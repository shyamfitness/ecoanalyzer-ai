import OpenAI from 'openai';

const hasApiKey = Boolean(process.env.OPENAI_API_KEY);
const openaiClient = hasApiKey
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

const MODEL_NAME = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const sanitizeJson = (raw = '') =>
  raw.replace(/```json/gi, '').replace(/```/g, '').trim();

export class OpenAIService {
  static async extractProductSignals(productData) {
    if (!openaiClient) {
      return this.fallbackSignals(productData);
    }

    const prompt = this.buildPrompt(productData);

    try {
      const completion = await openaiClient.chat.completions.create({
        model: MODEL_NAME,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are a sustainability scientist. Extract factual lifecycle signals for scoring environmental impact. Respond with concise JSON only.',
          },
          { role: 'user', content: prompt },
        ],
      });

      const message = completion.choices?.[0]?.message?.content;
      if (!message) {
        throw new Error('Empty response from OpenAI');
      }

      const parsed = JSON.parse(sanitizeJson(message));
      return {
        ...parsed,
        metadata: {
          model: MODEL_NAME,
          latencyMs: Number(completion.usage?.total_tokens || 0),
        },
      };
    } catch (error) {
      console.warn('OpenAI extraction failed, falling back:', error.message);
      return this.fallbackSignals(productData);
    }
  }

  static buildPrompt(productData) {
    const { name, description, origin, inputMethod, extractedText, barcode } =
      productData;

    return `
Extract sustainability signals for the product below. Use existing knowledge or the provided description. Return JSON with keys:
  - "category": string
  - "summary": 1-2 sentence overview
  - "materials": { "sourcingScore": number(0-100), "recycledContent": number(0-100), "containsCriticalMinerals": boolean, "containsSingleUsePlastic": boolean, "certifications": [string], "notes": string, "highlights": [string], "risks": [string] }
  - "packaging": { "sustainabilityScore": number, "recycledContent": number, "isCompostable": boolean, "isMultiLayered": boolean, "containsPVC": boolean, "notes": string, "highlights": [string], "risks": [string] }
  - "shipping": { "efficiencyScore": number, "distanceKm": number, "primaryMode": "air"|"sea"|"road"|"rail", "offsetPrograms": boolean, "notes": string, "highlights": [string], "risks": [string] }
  - "endOfLife": { "circularityScore": number, "isRepairable": boolean, "hasTakeBackProgram": boolean, "containsMixedMaterials": boolean, "requiresSpecialRecycling": boolean, "notes": string, "highlights": [string], "risks": [string] }
  - "metrics": { "carbonKg": number, "waterLiters": number, "wasteKg": number }
  - "highlights": [string]
  - "risks": [string]
  - "recommendations": [string]

Product name: ${name}
Origin: ${origin || 'Unknown'}
Barcode: ${barcode || 'n/a'}
Input method: ${inputMethod}
Description: ${description || 'n/a'}
Extracted text: ${extractedText || 'n/a'}
`.trim();
  }

  static fallbackSignals(productData) {
    const text = `${productData.name} ${productData.description}`.toLowerCase();
    const category = this.categorizeProduct(text);

    return {
      category,
      summary: `Heuristic analysis for ${productData.name}.`,
      materials: {
        sourcingScore: this.baseScoreByCategory(category),
        recycledContent: text.includes('recycled') ? 60 : 20,
        containsCriticalMinerals: /battery|lithium|cobalt/.test(text),
        containsSingleUsePlastic: /plastic|pet/.test(text),
        certifications: [],
        notes: 'Automatically inferred from product name/description.',
        highlights: text.includes('organic')
          ? ['Organic ingredients detected.']
          : [],
        risks: /disposable|single-use/.test(text)
          ? ['Appears to be single-use.']
          : [],
      },
      packaging: {
        sustainabilityScore: text.includes('paper') ? 70 : 55,
        recycledContent: text.includes('recycled') ? 50 : 15,
        isCompostable: text.includes('compostable'),
        isMultiLayered: /pouch|laminate/.test(text),
        containsPVC: false,
        notes: 'Packaging heuristics generated without AI.',
        highlights: [],
        risks: [],
      },
      shipping: {
        efficiencyScore: productData.origin === 'local' ? 75 : 60,
        distanceKm: productData.origin === 'local' ? 200 : 5800,
        primaryMode: 'sea',
        offsetPrograms: false,
        notes: 'Shipping estimated from origin.',
        highlights: [],
        risks: productData.origin === 'Unknown' ? ['Origin unclear.'] : [],
      },
      endOfLife: {
        circularityScore: /recyclable|reusable/.test(text) ? 70 : 55,
        isRepairable: /repair|modular/.test(text),
        hasTakeBackProgram: false,
        containsMixedMaterials: /composite|mixed/.test(text),
        requiresSpecialRecycling: /battery|electronics/.test(text),
        notes: 'End-of-life heuristics generated locally.',
        highlights: [],
        risks: [],
      },
      metrics: {
        carbonKg: this.estimateCarbon(category),
        waterLiters: this.estimateWater(category),
        wasteKg: 0.6,
      },
      highlights: ['Heuristic fallback in effect'],
      risks: [],
      recommendations: [
        'Verify supplier-level environmental data for better accuracy.',
        'Increase recycled content where feasible.',
        'Communicate end-of-life options to customers.',
      ],
      metadata: {
        model: 'heuristic-fallback',
      },
    };
  }

  static categorizeProduct(text) {
    if (text.includes('phone') || text.includes('laptop')) return 'Electronics';
    if (text.includes('shirt') || text.includes('jacket')) return 'Apparel';
    if (text.includes('snack') || text.includes('organic') || text.includes('food')) return 'Food';
    if (text.includes('detergent') || text.includes('cleaner')) return 'Household';
    if (text.includes('chair') || text.includes('desk')) return 'Furniture';
    return 'General';
  }

  static baseScoreByCategory(category) {
    const map = {
      Electronics: 55,
      Apparel: 65,
      Food: 70,
      Household: 60,
      Furniture: 68,
      General: 62,
    };
    return map[category] ?? 60;
  }

  static estimateCarbon(category) {
    const map = {
      Electronics: 24,
      Apparel: 14,
      Food: 8,
      Household: 10,
      Furniture: 18,
      General: 12,
    };
    return map[category] ?? 12;
  }

  static estimateWater(category) {
    const map = {
      Electronics: 350,
      Apparel: 1500,
      Food: 600,
      Household: 420,
      Furniture: 800,
      General: 500,
    };
    return map[category] ?? 500;
  }
}
