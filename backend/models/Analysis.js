import mongoose from 'mongoose';

const breakdownSchema = new mongoose.Schema(
  {
    label: String,
    score: { type: Number, min: 0, max: 100 },
    weight: Number,
    notes: String,
    highlights: [String],
    risks: [String],
  },
  { _id: false }
);

const metricSchema = new mongoose.Schema(
  {
    value: Number,
    unit: String,
    context: String,
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    productRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    product: {
      name: { type: String, required: true, trim: true },
      brand: { type: String, trim: true },
      description: { type: String, default: '', trim: true },
      origin: { type: String, default: 'Unknown', trim: true },
      category: { type: String, default: 'General', trim: true },
      barcode: { type: String, trim: true },
      imageUrl: String,
    },
    source: {
      type: String,
      enum: ['text', 'image', 'barcode'],
      required: true,
    },
    inputSummary: String,
    extractedText: String,
    environmentalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    grade: {
      type: String,
      enum: ['A+', 'A', 'B', 'C', 'D', 'E'],
      required: true,
    },
    breakdown: {
      materials: breakdownSchema,
      packaging: breakdownSchema,
      shipping: breakdownSchema,
      endOfLife: breakdownSchema,
    },
    metrics: {
      carbon: metricSchema,
      water: metricSchema,
      waste: metricSchema,
    },
    explainability: {
      summary: String,
      positives: [String],
      negatives: [String],
      lastUpdated: Date,
    },
    recommendations: [String],
    tags: [String],
    aiMetadata: {
      model: String,
      latencyMs: Number,
    },
    metadata: {
      processingTimeMs: Number,
      apiVersion: { type: String, default: 'v1' },
    },
  },
  {
    timestamps: true,
  }
);

analysisSchema.index({ user: 1, createdAt: -1 });
analysisSchema.index({ 'product.name': 'text', 'product.description': 'text' });
analysisSchema.index({ grade: 1 });
analysisSchema.index({ environmentalScore: -1 });

analysisSchema.virtual('scoreLabel').get(function () {
  if (this.environmentalScore >= 85) return 'Low Impact';
  if (this.environmentalScore >= 70) return 'Moderate Impact';
  if (this.environmentalScore >= 55) return 'High Impact';
  return 'Critical Impact';
});

analysisSchema.methods.toDigest = function () {
  return {
    id: this._id,
    product: this.product,
    environmentalScore: this.environmentalScore,
    grade: this.grade,
    breakdown: this.breakdown,
    metrics: this.metrics,
    explainability: this.explainability,
    recommendations: this.recommendations,
    createdAt: this.createdAt,
  };
};

export default mongoose.model('Analysis', analysisSchema);
