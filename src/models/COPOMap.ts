import mongoose from 'mongoose';

const COPOMapSchema = new mongoose.Schema({
  // Placeholder fields
  createdAt: { type: Date, default: Date.now }
});

export const COPOMap = mongoose.models.COPOMap || mongoose.model('COPOMap', COPOMapSchema);
