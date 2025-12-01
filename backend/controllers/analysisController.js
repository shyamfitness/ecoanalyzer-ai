import { z } from 'zod';
import Analysis from '../models/Analysis.js';
import Product from '../models/Product.js';
import { OpenAIService } from '../services/openaiService.js';
import { ocrService } from '../services/ocrService.js';
import { barcodeService } from '../services/barcodeService.js';
import { pdfService } from '../services/pdfService.js';
import { scoringEngine } from '../utils/scoringEngine.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const textAnalyzeSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().min(20, 'Provide at least 20 characters').max(2000),
  origin: z.string().min(2).max(120).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const barcodeSchema = z.object({
  barcode: z.string().min(6),
  name: z.string().optional(),
  description: z.string().optional(),
  origin: z.string().optional(),
});

const buildSnapshot = (payload, productDoc, signals) => ({
  name: payload.name || productDoc?.name,
  brand: payload.brand || productDoc?.brand,
  description: payload.description || productDoc?.description,
  origin: payload.origin || productDoc?.origin || 'Unknown',
  category: signals.category || payload.category || productDoc?.category || 'General',
  barcode: payload.barcode || productDoc?.barcode,
  imageUrl: productDoc?.imageUrl,
});

const formatAnalysisResponse = (analysis) => ({
  id: analysis._id,
  product: analysis.product,
  productRef: analysis.productRef,
  source: analysis.source,
  environmentalScore: analysis.environmentalScore,
  grade: analysis.grade,
  breakdown: analysis.breakdown,
  metrics: analysis.metrics,
  explainability: analysis.explainability,
  recommendations: analysis.recommendations,
  tags: analysis.tags,
  createdAt: analysis.createdAt,
});

const persistProduct = async (payload, signals, score) => {
  const lookup = payload.barcode
    ? { barcode: payload.barcode }
    : { name: payload.name.trim().toLowerCase() };

  let productDoc =
    (await Product.findOne(payload.barcode ? lookup : { name: payload.name })) ||
    new Product({
      name: payload.name,
      brand: payload.brand,
      barcode: payload.barcode,
      description: payload.description,
      origin: payload.origin,
      category: signals.category,
      imageUrl: payload.imageUrl,
    });

  productDoc.category = signals.category || productDoc.category;
  productDoc.materials =
    payload.materials ||
    productDoc.materials ||
    (signals.materials
      ? [
          {
            name: 'Primary material mix',
            share: signals.materials.recycledContent,
            sustainabilityScore: signals.materials.sourcingScore,
          },
        ]
      : []);
  productDoc.packaging =
    payload.packaging ||
    productDoc.packaging || {
      material: signals.packaging?.isCompostable ? 'Compostable' : 'Mixed',
      recycledContent: signals.packaging?.recycledContent,
      isCompostable: signals.packaging?.isCompostable,
      notes: signals.packaging?.notes,
    };
  productDoc.certifications =
    payload.certifications || signals.materials?.certifications || productDoc.certifications;
  productDoc.updateAverages(score);
  await productDoc.save();

  return productDoc;
};

const runAnalysisPipeline = async ({
  payload,
  source = 'text',
  extractedText = '',
  user,
}) => {
  const started = Date.now();

  const signals = await OpenAIService.extractProductSignals({
    ...payload,
    inputMethod: source,
    extractedText,
  });

  const scoring = scoringEngine.calculate(signals);
  const productDoc = await persistProduct(payload, signals, scoring.environmentalScore);

  const analysis = await Analysis.create({
    user: user?._id,
    productRef: productDoc._id,
    product: buildSnapshot(payload, productDoc, signals),
    source,
    inputSummary: payload.description?.slice(0, 280),
    extractedText,
    environmentalScore: scoring.environmentalScore,
    grade: scoring.grade,
    breakdown: scoring.breakdown,
    metrics: scoring.metrics,
    explainability: scoring.explainability,
    recommendations: scoring.recommendations,
    tags: payload.tags || [],
    aiMetadata: signals.metadata,
    metadata: {
      processingTimeMs: Date.now() - started,
      apiVersion: 'v1',
    },
  });

  if (user) {
    user.updateAnalytics(scoring.environmentalScore, scoring.grade);
    await user.save();
  }

  return analysis;
};

export const analyzeText = asyncHandler(async (req, res) => {
  const validation = textAnalyzeSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: validation.error.errors[0].message,
    });
  }

  const payload = validation.data;
  const analysis = await runAnalysisPipeline({
    payload,
    source: 'text',
    user: req.user,
  });

  res.status(201).json({ success: true, analysis: formatAnalysisResponse(analysis) });
});

export const analyzeImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Image upload is required' });
  }

  const ocrResult = await ocrService.extractText(req.file.buffer);
  const payload = {
    name: req.body.name || 'Image derived product',
    description: req.body.description || ocrResult.text?.slice(0, 1000) || '',
    origin: req.body.origin || 'Unknown',
    category: req.body.category,
    tags: req.body.tags ? [].concat(req.body.tags) : [],
  };

  const analysis = await runAnalysisPipeline({
    payload,
    source: 'image',
    extractedText: ocrResult.text,
    user: req.user,
  });

  res.status(201).json({
    success: true,
    analysis: {
      ...formatAnalysisResponse(analysis),
      ocrConfidence: ocrResult.confidence,
    },
  });
});

export const analyzeBarcode = asyncHandler(async (req, res) => {
  const validation = barcodeSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: validation.error.errors[0].message,
    });
  }

  const payload = validation.data;

  const barcodeData = await barcodeService.lookup(payload.barcode);
  const mergedPayload = {
    ...barcodeData,
    ...payload,
    description: payload.description || barcodeData?.description || '',
    name: payload.name || barcodeData?.name || `Product ${payload.barcode}`,
    origin: payload.origin || barcodeData?.origin || 'Unknown',
    barcode: payload.barcode,
  };

  const analysis = await runAnalysisPipeline({
    payload: mergedPayload,
    source: 'barcode',
    user: req.user,
  });

  res.status(201).json({ success: true, analysis: formatAnalysisResponse(analysis) });
});

export const getAnalysis = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findById(req.params.id).populate('productRef');

  if (!analysis || (req.user && analysis.user && !analysis.user.equals(req.user._id))) {
    return res.status(404).json({ success: false, error: 'Analysis not found' });
  }

  res.json({ success: true, analysis: formatAnalysisResponse(analysis) });
});

export const downloadAnalysisPdf = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findById(req.params.id);
  if (!analysis) {
    return res.status(404).json({ success: false, error: 'Analysis not found' });
  }

  const doc = pdfService.buildAnalysisReport(analysis);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="analysis-${analysis.id}.pdf"`
  );

  doc.pipe(res);
  doc.end();
});

