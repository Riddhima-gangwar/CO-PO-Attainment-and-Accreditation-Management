import {
  CourseOutcome,
  ProgramOutcome,
  initialCourseMapping,
  mockCourseOutcomes,
  mockProgramOutcomes,
} from '@/data/mockData';

/**
 * Outcome Service Abstraction Layer
 * Encapsulates operations for COs, POs, and CO-PO Correlation Mapping matrices.
 */
export const outcomeService = {
  async getCOs(courseId?: string): Promise<CourseOutcome[]> {
    if (!courseId) return Promise.resolve([...mockCourseOutcomes]);
    return Promise.resolve(mockCourseOutcomes.filter(co => co.courseId === courseId));
  },

  async getPOs(): Promise<ProgramOutcome[]> {
    return Promise.resolve([...mockProgramOutcomes]);
  },

  async getMapping(courseId: string): Promise<Record<string, number>> {
    // Return cloned mapping to maintain immutability
    return Promise.resolve({ ...initialCourseMapping });
  },

  async updateMapping(
    courseId: string,
    mappings: Record<string, number>
  ): Promise<{ success: boolean }> {
    return Promise.resolve({ success: true });
  },
};
