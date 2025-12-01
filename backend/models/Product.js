import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema(
  {
    name: String,
    share: Number,
    sustainabilityScore: Number,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    barcode: { type: String, trim: true, unique: true, sparse: true },
    category: { type: String, default: 'General', trim: true },
    description: { type: String, default: '', trim: true },
    origin: { type: String, default: 'Unknown', trim: true },
    imageUrl: String,
    materials: [materialSchema],
    packaging: {
      type: {
        material: String,
        recycledContent: Number,
        isCompostable: Boolean,
        notes: String,
      },
      default: {},
    },
    certifications: [String],
    averageScore: { type: Number, default: 0 },
    totalAnalyses: { type: Number, default: 0 },
    latestAnalysisAt: Date,
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 'text', description: 'text' });

productSchema.methods.updateAverages = function updateAverages(score) {
  this.totalAnalyses += 1;
  this.averageScore =
    (this.averageScore * (this.totalAnalyses - 1) + score) / this.totalAnalyses;
  this.latestAnalysisAt = new Date();
};

export default mongoose.model('Product', productSchema);

