import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPOAttainment extends Document {
  programId: string;
  poCode: string;
  title: string;
  targetScore: number;
  directAttainment: number;
  indirectAttainment: number;
  overallAttainment: number;
  status: 'Met' | 'Unmet';
  academicYear: string;
  createdAt: Date;
  updatedAt: Date;
}

const POAttainmentSchema = new Schema<IPOAttainment>(
  {
    programId: {
      type: String,
      required: true,
      index: true,
    },
    poCode: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    targetScore: {
      type: Number,
      required: true,
      default: 2.5,
    },
    directAttainment: {
      type: Number,
      required: true,
      default: 0,
    },
    indirectAttainment: {
      type: Number,
      required: true,
      default: 0,
    },
    overallAttainment: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Met', 'Unmet'],
      default: 'Unmet',
    },
    academicYear: {
      type: String,
      default: '2025-2026',
    },
  },
  {
    timestamps: true,
  }
);

POAttainmentSchema.index({ programId: 1, poCode: 1, academicYear: 1 }, { unique: true });

export const POAttainment: Model<IPOAttainment> =
  mongoose.models.POAttainment ||
  mongoose.model<IPOAttainment>('POAttainment', POAttainmentSchema);

export async function seedInitialPOAttainment() {
  const count = await POAttainment.countDocuments();
  if (count === 0) {
    const poAttainmentData = [
      { poCode: 'PO1', title: 'Engineering Knowledge', targetScore: 2.5, directAttainment: 2.65, indirectAttainment: 2.7, overallAttainment: 2.66, status: 'Met' as const },
      { poCode: 'PO2', title: 'Problem Analysis', targetScore: 2.5, directAttainment: 2.52, indirectAttainment: 2.6, overallAttainment: 2.54, status: 'Met' as const },
      { poCode: 'PO3', title: 'Design/Development of Solutions', targetScore: 2.3, directAttainment: 2.38, indirectAttainment: 2.45, overallAttainment: 2.39, status: 'Met' as const },
      { poCode: 'PO4', title: 'Conduct Investigations', targetScore: 2.2, directAttainment: 2.15, indirectAttainment: 2.2, overallAttainment: 2.16, status: 'Unmet' as const },
      { poCode: 'PO5', title: 'Modern Tool Usage', targetScore: 2.4, directAttainment: 2.48, indirectAttainment: 2.55, overallAttainment: 2.49, status: 'Met' as const },
      { poCode: 'PO6', title: 'The Engineer and Society', targetScore: 2.0, directAttainment: 2.1, indirectAttainment: 2.15, overallAttainment: 2.11, status: 'Met' as const },
      { poCode: 'PO7', title: 'Environment and Sustainability', targetScore: 2.0, directAttainment: 2.05, indirectAttainment: 2.1, overallAttainment: 2.06, status: 'Met' as const },
      { poCode: 'PO8', title: 'Ethics', targetScore: 2.5, directAttainment: 2.6, indirectAttainment: 2.65, overallAttainment: 2.61, status: 'Met' as const },
      { poCode: 'PO9', title: 'Individual & Team Work', targetScore: 2.5, directAttainment: 2.55, indirectAttainment: 2.6, overallAttainment: 2.56, status: 'Met' as const },
      { poCode: 'PO10', title: 'Communication', targetScore: 2.5, directAttainment: 2.45, indirectAttainment: 2.5, overallAttainment: 2.46, status: 'Unmet' as const },
      { poCode: 'PO11', title: 'Project Management & Finance', targetScore: 2.2, directAttainment: 2.25, indirectAttainment: 2.3, overallAttainment: 2.26, status: 'Met' as const },
      { poCode: 'PO12', title: 'Life-long Learning', targetScore: 2.4, directAttainment: 2.42, indirectAttainment: 2.48, overallAttainment: 2.43, status: 'Met' as const },
    ];

    for (const p of poAttainmentData) {
      await POAttainment.create({
        ...p,
        programId: 'prog-btech-cse',
        academicYear: '2025-2026',
      });
    }
    console.log('[Seed] Seeded initial PO Attainment into MongoDB');
  }
}
