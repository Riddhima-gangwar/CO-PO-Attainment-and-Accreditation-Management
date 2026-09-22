import mongoose from 'mongoose';

const POAttainmentSchema = new mongoose.Schema({
  // Placeholder fields
  createdAt: { type: Date, default: Date.now }
});

export const POAttainment = mongoose.models.POAttainment || mongoose.model('POAttainment', POAttainmentSchema);
