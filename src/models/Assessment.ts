import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAssessment extends Document {
  courseId: string;
  type: 'CIE_1' | 'CIE_2' | 'Assignment' | 'Quiz' | 'Lab_Exam' | 'Semester_End_Exam';
  title: string;
  maxMarks: number;
  weightage: number; // e.g. 20, 40 (%)
  coMappings?: { questionNumber: string; coCode: string; maxMarks: number }[];
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    courseId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['CIE_1', 'CIE_2', 'Assignment', 'Quiz', 'Lab_Exam', 'Semester_End_Exam'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    maxMarks: {
      type: Number,
      required: true,
      min: 1,
      default: 50,
    },
    weightage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 20,
    },
    coMappings: [
      {
        questionNumber: String,
        coCode: String,
        maxMarks: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Assessment: Model<IAssessment> =
  mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);

export async function seedInitialAssessments() {
  const count = await Assessment.countDocuments();
  if (count === 0) {
    const defaultAssessments = [
      {
        courseId: 'crs-1',
        type: 'CIE_1' as const,
        title: 'Continuous Internal Evaluation - 1 (Midterm)',
        maxMarks: 50,
        weightage: 25,
        coMappings: [
          { questionNumber: 'Q1', coCode: 'CO1', maxMarks: 15 },
          { questionNumber: 'Q2', coCode: 'CO2', maxMarks: 20 },
          { questionNumber: 'Q3', coCode: 'CO3', maxMarks: 15 },
        ],
      },
      {
        courseId: 'crs-1',
        type: 'CIE_2' as const,
        title: 'Continuous Internal Evaluation - 2',
        maxMarks: 50,
        weightage: 25,
        coMappings: [
          { questionNumber: 'Q1', coCode: 'CO3', maxMarks: 15 },
          { questionNumber: 'Q2', coCode: 'CO4', maxMarks: 20 },
          { questionNumber: 'Q3', coCode: 'CO5', maxMarks: 15 },
        ],
      },
      {
        courseId: 'crs-1',
        type: 'Assignment' as const,
        title: 'Algorithmic Problem Solving & Code Portfolio',
        maxMarks: 20,
        weightage: 10,
        coMappings: [
          { questionNumber: 'Prog1', coCode: 'CO2', maxMarks: 10 },
          { questionNumber: 'Prog2', coCode: 'CO4', maxMarks: 10 },
        ],
      },
      {
        courseId: 'crs-1',
        type: 'Semester_End_Exam' as const,
        title: 'Comprehensive University Semester Examination',
        maxMarks: 100,
        weightage: 40,
        coMappings: [
          { questionNumber: 'PartA', coCode: 'CO1', maxMarks: 20 },
          { questionNumber: 'PartB', coCode: 'CO2', maxMarks: 20 },
          { questionNumber: 'PartC', coCode: 'CO3', maxMarks: 20 },
          { questionNumber: 'PartD', coCode: 'CO4', maxMarks: 20 },
          { questionNumber: 'PartE', coCode: 'CO5', maxMarks: 20 },
        ],
      },
    ];

    for (const a of defaultAssessments) {
      await Assessment.create(a);
    }
    console.log('[Seed] Seeded initial assessments into MongoDB');
  }
}
