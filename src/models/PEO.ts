import mongoose from 'mongoose';

const PEOSchema = new mongoose.Schema({
  // Placeholder fields
  createdAt: { type: Date, default: Date.now }
});

export const PEO = mongoose.models.PEO || mongoose.model('PEO', PEOSchema);
