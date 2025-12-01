import dayjs from 'dayjs';

const CATEGORY_WEIGHTS = {
  materials: 0.35,
  packaging: 0.2,
  shipping: 0.25,
  endOfLife: 0.2,
};

const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);

const gradeFromScore = (score) => {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'E';
};

const computeCategoryScore = ({ baseScore = 70, penalties = [], bonuses = [] }) => {
  let score = baseScore;

  penalties.forEach((penalty) => {
    score -= penalty.weight * 10;
  });

  bonuses.forEach((bonus) => {
    score += bonus.weight * 10;
  });

  return clamp(score);
};

export const scoringEngine = {
  calculate(productSignals = {}) {
    const breakdown = {};

    const materialsScore = computeCategoryScore({
      baseScore: productSignals.materials?.sourcingScore ?? 70,
      penalties: [
        ...(productSignals.materials?.containsCriticalMinerals ? [{ weight: 1.2 }] : []),
        ...(productSignals.materials?.containsSingleUsePlastic ? [{ weight: 1.5 }] : []),
      ],
      bonuses: [
        ...(productSignals.materials?.recycledContent > 40 ? [{ weight: 1.4 }] : []),
        ...(productSignals.materials?.certifications?.length ? [{ weight: 0.8 }] : []),
      ],
    });

    breakdown.materials = {
      label: 'Materials & Sourcing',
      score: materialsScore,
      weight: CATEGORY_WEIGHTS.materials,
      notes: productSignals.materials?.notes || 'Material data synthesized by AI',
      highlights: productSignals.materials?.highlights || [],
      risks: productSignals.materials?.risks || [],
    };

    const packagingScore = computeCategoryScore({
      baseScore: productSignals.packaging?.sustainabilityScore ?? 65,
      penalties: [
        ...(productSignals.packaging?.isMultiLayered ? [{ weight: 1.5 }] : []),
        ...(productSignals.packaging?.containsPVC ? [{ weight: 1.2 }] : []),
      ],
      bonuses: [
        ...(productSignals.packaging?.recycledContent > 50 ? [{ weight: 1.5 }] : []),
        ...(productSignals.packaging?.isCompostable ? [{ weight: 1 }] : []),
      ],
    });

    breakdown.packaging = {
      label: 'Packaging & Materials',
      score: packagingScore,
      weight: CATEGORY_WEIGHTS.packaging,
      notes: productSignals.packaging?.notes || 'Packaging impact estimation',
      highlights: productSignals.packaging?.highlights || [],
      risks: productSignals.packaging?.risks || [],
    };

    const shippingScore = computeCategoryScore({
      baseScore: productSignals.shipping?.efficiencyScore ?? 60,
      penalties: [
        ...(productSignals.shipping?.distanceKm > 4000 ? [{ weight: 1.7 }] : []),
        ...(productSignals.shipping?.primaryMode === 'air' ? [{ weight: 2 }] : []),
      ],
      bonuses: [
        ...(productSignals.shipping?.primaryMode === 'sea' ? [{ weight: 0.8 }] : []),
        ...(productSignals.shipping?.offsetPrograms ? [{ weight: 0.6 }] : []),
      ],
    });

    breakdown.shipping = {
      label: 'Logistics & Shipping',
      score: shippingScore,
      weight: CATEGORY_WEIGHTS.shipping,
      notes: productSignals.shipping?.notes || 'Logistics estimate based on origin',
      highlights: productSignals.shipping?.highlights || [],
      risks: productSignals.shipping?.risks || [],
    };

    const endOfLifeScore = computeCategoryScore({
      baseScore: productSignals.endOfLife?.circularityScore ?? 65,
      penalties: [
        ...(productSignals.endOfLife?.containsMixedMaterials ? [{ weight: 1.2 }] : []),
        ...(productSignals.endOfLife?.requiresSpecialRecycling ? [{ weight: 1 }] : []),
      ],
      bonuses: [
        ...(productSignals.endOfLife?.isRepairable ? [{ weight: 1.2 }] : []),
        ...(productSignals.endOfLife?.hasTakeBackProgram ? [{ weight: 1 }] : []),
      ],
    });

    breakdown.endOfLife = {
      label: 'End-of-life & Circularity',
      score: endOfLifeScore,
      weight: CATEGORY_WEIGHTS.endOfLife,
      notes: productSignals.endOfLife?.notes || 'Circularity estimate',
      highlights: productSignals.endOfLife?.highlights || [],
      risks: productSignals.endOfLife?.risks || [],
    };

    const weightedScore = Object.values(breakdown).reduce(
      (acc, category) => acc + category.score * category.weight,
      0
    );

    const roundedScore = Number(weightedScore.toFixed(1));
    const grade = gradeFromScore(roundedScore);

    const explainability = {
      summary:
        productSignals.summary ||
        'AI-generated assessment combining materials, logistics, packaging, and end-of-life insights.',
      positives: [
        ...(productSignals.highlights || []),
        ...(Object.values(breakdown)
          .filter((item) => item.score >= 75)
          .map((item) => `${item.label} performs above sustainable baseline.`)),
      ],
      negatives: [
        ...(productSignals.risks || []),
        ...(Object.values(breakdown)
          .filter((item) => item.score < 60)
          .map((item) => `${item.label} requires attention to reduce impact.`)),
      ],
      lastUpdated: dayjs().toISOString(),
    };

    const metrics = {
      carbon: {
        value: productSignals.metrics?.carbonKg ?? 12,
        unit: 'kg CO2e',
        context: 'Estimated lifecycle carbon footprint per unit',
      },
      water: {
        value: productSignals.metrics?.waterLiters ?? 450,
        unit: 'L',
        context: 'Estimated lifecycle freshwater consumption',
      },
      waste: {
        value: productSignals.metrics?.wasteKg ?? 0.8,
        unit: 'kg',
        context: 'Estimated solid waste generated per unit',
      },
    };

    return {
      environmentalScore: roundedScore,
      grade,
      breakdown,
      metrics,
      explainability,
      recommendations:
        productSignals.recommendations || [
          'Source high recycled-content materials to further reduce impact.',
          'Optimize transport to reduce air freight dependency.',
          'Communicate end-of-life guidance to customers to improve recycling rates.',
        ],
    };
  },
};

