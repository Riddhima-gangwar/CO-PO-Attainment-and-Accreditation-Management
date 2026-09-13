import mongoose from 'mongoose';

const PSOSchema = new mongoose.Schema({
  // Placeholder fields
  createdAt: { type: Date, default: Date.now }
});

export const PSO = mongoose.models.PSO || mongoose.model('PSO', PSOSchema);
