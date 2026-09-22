import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  // Placeholder fields
  createdAt: { type: Date, default: Date.now }
});

export const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
