import mongoose from 'mongoose';

const ProgramSchema = new mongoose.Schema({
  // Placeholder fields
  createdAt: { type: Date, default: Date.now }
});

export const Program = mongoose.models.Program || mongoose.model('Program', ProgramSchema);
