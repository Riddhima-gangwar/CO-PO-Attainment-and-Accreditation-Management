import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvidenceDocument extends Document {
  criterionId: string;
  courseId?: string;
  title: string;
  category: 'Question Paper' | 'Answer Script' | 'Rubric Evaluation' | 'Course File' | 'Exit Survey';
  uploadedBy: string;
  academicYear: string;
  fileSize: string;
  status: 'Verified' | 'Pending Review' | 'Flagged';
  complianceScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const EvidenceDocumentSchema = new Schema<IEvidenceDocument>(
  {
    criterionId: {
      type: String,
      required: true,
      index: true,
    },
    courseId: {
      type: String,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Question Paper', 'Answer Script', 'Rubric Evaluation', 'Course File', 'Exit Survey'],
      required: true,
    },
    uploadedBy: {
      type: String,
      default: 'Dr. Sarah Jenkins',
    },
    academicYear: {
      type: String,
      default: '2025-2026',
    },
    fileSize: {
      type: String,
      default: '1.4 MB',
    },
    status: {
      type: String,
      enum: ['Verified', 'Pending Review', 'Flagged'],
      default: 'Verified',
    },
    complianceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 85,
    },
  },
  {
    timestamps: true,
  }
);

export const EvidenceDocument: Model<IEvidenceDocument> =
  mongoose.models.EvidenceDocument ||
  mongoose.model<IEvidenceDocument>('EvidenceDocument', EvidenceDocumentSchema);

export async function seedInitialEvidence() {
  const count = await EvidenceDocument.countDocuments();
  if (count === 0) {
    const defaultEvidence = [
      {
        criterionId: 'crit-3',
        courseId: 'crs-1',
        title: 'CS301 Complete Course File Binder with CO Formulations',
        category: 'Course File' as const,
        uploadedBy: 'Dr. Sarah Jenkins',
        academicYear: '2025-2026',
        fileSize: '4.8 MB',
        status: 'Verified' as const,
        complianceScore: 95,
      },
      {
        criterionId: 'crit-3',
        courseId: 'crs-1',
        title: 'CIE-1 Question Paper with Bloom Taxonomy & CO Tagging Scheme',
        category: 'Question Paper' as const,
        uploadedBy: 'Dr. Sarah Jenkins',
        academicYear: '2025-2026',
        fileSize: '1.2 MB',
        status: 'Verified' as const,
        complianceScore: 92,
      },
      {
        criterionId: 'crit-2',
        courseId: 'crs-1',
        title: 'Sample Evaluated Student Answer Scripts (High, Medium, Low Bands)',
        category: 'Answer Script' as const,
        uploadedBy: 'Dr. Sarah Jenkins',
        academicYear: '2025-2026',
        fileSize: '6.5 MB',
        status: 'Verified' as const,
        complianceScore: 88,
      },
      {
        criterionId: 'crit-3',
        courseId: 'crs-1',
        title: 'Indirect Assessment: Graduating Batch Course Exit Feedback Forms',
        category: 'Exit Survey' as const,
        uploadedBy: 'Dr. Robert Vance',
        academicYear: '2025-2026',
        fileSize: '820 KB',
        status: 'Verified' as const,
        complianceScore: 90,
      },
    ];

    for (const e of defaultEvidence) {
      await EvidenceDocument.create(e);
    }
    console.log('[Seed] Seeded initial evidence documents into MongoDB');
  }
}
