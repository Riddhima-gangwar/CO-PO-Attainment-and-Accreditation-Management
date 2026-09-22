import mongoose from 'mongoose';

const COAttainmentSchema = new mongoose.Schema({
  // Placeholder fields
  createdAt: { type: Date, default: Date.now }
});

export const COAttainment = mongoose.models.COAttainment || mongoose.model('COAttainment', COAttainmentSchema);
