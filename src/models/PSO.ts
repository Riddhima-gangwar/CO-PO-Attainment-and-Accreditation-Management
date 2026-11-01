import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPSO extends Document {
  code: string;
  title: string;
  statement: string;
  targetScore: number;
  programId: string;
  createdAt: Date;
  updatedAt: Date;
}

const PSOSchema = new Schema<IPSO>(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    statement: {
      type: String,
      required: true,
      trim: true,
    },
    targetScore: {
      type: Number,
      default: 2.5,
    },
    programId: {
      type: String,
      default: 'prog-btech-cse',
    },
  },
  {
    timestamps: true,
  }
);

PSOSchema.index({ programId: 1, code: 1 }, { unique: true });

export const PSO: Model<IPSO> = mongoose.models.PSO || mongoose.model<IPSO>('PSO', PSOSchema);

export async function seedInitialPSOs() {
  const count = await PSO.countDocuments();
  if (count === 0) {
    const defaultPSOs = [
      {
        code: 'PSO1',
        title: 'System Software & Architecture',
        statement: 'Apply standard software engineering principles, algorithms, and system architectures to construct robust and scalable computing applications.',
        targetScore: 2.4,
        programId: 'prog-btech-cse',
      },
      {
        code: 'PSO2',
        title: 'Data Intelligence & Cloud Computing',
        statement: 'Utilize machine learning, data engineering, and modern cloud deployment pipelines to extract actionable insights and automate institutional workflows.',
        targetScore: 2.3,
        programId: 'prog-btech-cse',
      },
    ];

    for (const pso of defaultPSOs) {
      await PSO.create(pso);
    }
    console.log('[Seed] Seeded initial PSOs into MongoDB');
  }
}
