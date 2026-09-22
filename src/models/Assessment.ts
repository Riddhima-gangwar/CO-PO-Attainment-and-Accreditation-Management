import mongoose from 'mongoose';

const AssessmentSchema = new mongoose.Schema({
  // Placeholder fields
  createdAt: { type: Date, default: Date.now }
});

export const Assessment = mongoose.models.Assessment || mongoose.model('Assessment', AssessmentSchema);
