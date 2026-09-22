import mongoose from 'mongoose';

const AssessmentQuestionSchema = new mongoose.Schema({
  // Placeholder fields
  createdAt: { type: Date, default: Date.now }
});

export const AssessmentQuestion = mongoose.models.AssessmentQuestion || mongoose.model('AssessmentQuestion', AssessmentQuestionSchema);
