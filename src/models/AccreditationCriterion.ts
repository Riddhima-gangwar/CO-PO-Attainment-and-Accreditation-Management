import mongoose from 'mongoose';

const AccreditationCriterionSchema = new mongoose.Schema({
  // Placeholder fields
  createdAt: { type: Date, default: Date.now }
});

export const AccreditationCriterion = mongoose.models.AccreditationCriterion || mongoose.model('AccreditationCriterion', AccreditationCriterionSchema);
