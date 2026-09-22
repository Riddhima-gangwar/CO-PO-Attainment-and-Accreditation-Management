import mongoose from 'mongoose';

const StudentMarkSchema = new mongoose.Schema({
  // Placeholder fields
  createdAt: { type: Date, default: Date.now }
});

export const StudentMark = mongoose.models.StudentMark || mongoose.model('StudentMark', StudentMarkSchema);
