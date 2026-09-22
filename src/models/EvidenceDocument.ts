import mongoose from 'mongoose';

const EvidenceDocumentSchema = new mongoose.Schema({
  // Placeholder fields
  createdAt: { type: Date, default: Date.now }
});

export const EvidenceDocument = mongoose.models.EvidenceDocument || mongoose.model('EvidenceDocument', EvidenceDocumentSchema);
