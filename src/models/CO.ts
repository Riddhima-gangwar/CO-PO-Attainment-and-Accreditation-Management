import mongoose from 'mongoose';

const COSchema = new mongoose.Schema({
  // Placeholder fields
  createdAt: { type: Date, default: Date.now }
});

export const CO = mongoose.models.CO || mongoose.model('CO', COSchema);
