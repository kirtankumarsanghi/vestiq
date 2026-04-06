const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    value: { type: Number, required: true },
    products: { type: [String], default: [] },
    rationale: { type: String, default: '' },
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    profile: { type: Object, required: true },
    annualRate: { type: Number, required: true },
    projectedCorpus: { type: Number, required: true },
    yearsRequired: { type: Number, required: true },
    chart: { type: [Object], default: [] },
    allocation: { type: [Object], default: [] },
    recommendations: { type: [recommendationSchema], default: [] },
    generatedAt: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);
