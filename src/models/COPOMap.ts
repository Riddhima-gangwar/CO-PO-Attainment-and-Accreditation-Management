import mongoose, { Schema, Document, Model } from 'mongoose';
import { initialCourseMapping } from '@/data/mockData';

export interface ICOPOMap extends Document {
  courseId: string;
  coId: string;
  poId: string;
  correlationLevel: number; // 0 (None), 1 (Low), 2 (Medium), 3 (High)
  justification?: string;
  createdAt: Date;
  updatedAt: Date;
}

const COPOMapSchema = new Schema<ICOPOMap>(
  {
    courseId: {
      type: String,
      required: true,
      index: true,
    },
    coId: {
      type: String,
      required: true,
      index: true,
    },
    poId: {
      type: String,
      required: true,
      index: true,
    },
    correlationLevel: {
      type: Number,
      enum: [0, 1, 2, 3],
      default: 0,
      required: true,
    },
    justification: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

COPOMapSchema.index({ courseId: 1, coId: 1, poId: 1 }, { unique: true });

export const COPOMap: Model<ICOPOMap> =
  mongoose.models.COPOMap || mongoose.model<ICOPOMap>('COPOMap', COPOMapSchema);

export async function seedInitialMappings() {
  const count = await COPOMap.countDocuments();
  if (count === 0) {
    const courseId = 'crs-1';
    for (const [key, level] of Object.entries(initialCourseMapping)) {
      const [coId, poId] = key.split('_');
      if (coId && poId) {
        await COPOMap.create({
          courseId,
          coId,
          poId,
          correlationLevel: level,
        });
      }
    }
    console.log('[Seed] Seeded initial CO-PO mappings into MongoDB');
  }
}
