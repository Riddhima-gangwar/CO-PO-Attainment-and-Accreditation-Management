import mongoose from 'mongoose';

const AccreditationFrameworkSchema = new mongoose.Schema({
  // Placeholder fields
  createdAt: { type: Date, default: Date.now }
});

export const AccreditationFramework = mongoose.models.AccreditationFramework || mongoose.model('AccreditationFramework', AccreditationFrameworkSchema);
