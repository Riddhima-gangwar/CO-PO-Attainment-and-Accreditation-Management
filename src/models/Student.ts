import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  // Placeholder fields
  createdAt: { type: Date, default: Date.now }
});

export const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);
