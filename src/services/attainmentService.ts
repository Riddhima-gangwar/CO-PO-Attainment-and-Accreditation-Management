import {
  COAttainmentData,
  ReportItem,
  mockCOAttainmentList,
  mockReports,
} from '@/data/mockData';

/**
 * Attainment & Reporting Service Abstraction Layer
 * Encapsulates operations for direct/indirect attainment and accreditation reports.
 */
export const attainmentService = {
  async getCOAttainment(courseId?: string): Promise<COAttainmentData[]> {
    if (!courseId) return Promise.resolve([...mockCOAttainmentList]);
    return Promise.resolve(mockCOAttainmentList.filter(a => a.courseId === courseId));
  },

  async getReports(): Promise<ReportItem[]> {
    return Promise.resolve([...mockReports]);
  },
};
