import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAccreditationCriterion extends Document {
  criterionNumber: number;
  code: string;
  name: string;
  maxMarks: number;
  attainedMarks: number;
  percentageScore: number;
  description: string;
  status: 'Compliant' | 'Substantially Compliant' | 'Remediation Required';
  createdAt: Date;
  updatedAt: Date;
}

const AccreditationCriterionSchema = new Schema<IAccreditationCriterion>(
  {
    criterionNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    maxMarks: {
      type: Number,
      required: true,
    },
    attainedMarks: {
      type: Number,
      required: true,
    },
    percentageScore: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Compliant', 'Substantially Compliant', 'Remediation Required'],
      default: 'Compliant',
    },
  },
  {
    timestamps: true,
  }
);

export const AccreditationCriterion: Model<IAccreditationCriterion> =
  mongoose.models.AccreditationCriterion ||
  mongoose.model<IAccreditationCriterion>('AccreditationCriterion', AccreditationCriterionSchema);

export async function seedInitialCriteria() {
  const count = await AccreditationCriterion.countDocuments();
  if (count === 0) {
    const defaultCriteria = [
      {
        criterionNumber: 1,
        code: 'CRIT-1',
        name: 'Vision, Mission and Program Educational Objectives (PEOs)',
        maxMarks: 50,
        attainedMarks: 44,
        percentageScore: 88,
        description: 'Establishment, correlation, and stakeholder involvement in Vision/Mission/PEOs',
        status: 'Compliant' as const,
      },
      {
        criterionNumber: 2,
        code: 'CRIT-2',
        name: 'Program Curriculum and Teaching-Learning Processes',
        maxMarks: 100,
        attainedMarks: 86,
        percentageScore: 86,
        description: 'Structure, delivery modes, laboratory experience, and continuous assessment',
        status: 'Compliant' as const,
      },
      {
        criterionNumber: 3,
        code: 'CRIT-3',
        name: 'Course Outcomes (COs) and Program Outcomes (POs)',
        maxMarks: 175,
        attainedMarks: 148,
        percentageScore: 84.6,
        description: 'CO establishment, mapping with PO/PSO, and direct/indirect attainment measurement',
        status: 'Compliant' as const,
      },
      {
        criterionNumber: 4,
        code: 'CRIT-4',
        name: 'Students Performance & Placement',
        maxMarks: 100,
        attainedMarks: 78,
        percentageScore: 78,
        description: 'Academic progress, placement ratios, professional society participation',
        status: 'Substantially Compliant' as const,
      },
      {
        criterionNumber: 5,
        code: 'CRIT-5',
        name: 'Faculty Information and Contributions',
        maxMarks: 200,
        attainedMarks: 172,
        percentageScore: 86,
        description: 'Student-faculty ratio, cadre ratio, qualifications, research and publications',
        status: 'Compliant' as const,
      },
    ];

    for (const c of defaultCriteria) {
      await AccreditationCriterion.create(c);
    }
    console.log('[Seed] Seeded initial criteria into MongoDB');
  }
}
