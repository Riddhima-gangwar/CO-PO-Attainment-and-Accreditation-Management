import mongoose from 'mongoose';

const POSchema = new mongoose.Schema({
  // Placeholder fields
  createdAt: { type: Date, default: Date.now }
});

export const PO = mongoose.models.PO || mongoose.model('PO', POSchema);
