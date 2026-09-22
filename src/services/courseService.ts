import { Course, Department, mockCourses, mockDepartments } from '@/data/mockData';

/**
 * Course Service Abstraction Layer
 * Encapsulates data fetching and mutation for courses and departments.
 * Ready to be swapped for real Next.js API / MongoDB endpoints.
 */
export const courseService = {
  async getCourses(): Promise<Course[]> {
    // Simulating async network resolution
    return Promise.resolve([...mockCourses]);
  },

  async getCourseById(id: string): Promise<Course | undefined> {
    return Promise.resolve(mockCourses.find(c => c.id === id));
  },

  async getDepartments(): Promise<Department[]> {
    return Promise.resolve([...mockDepartments]);
  },

  async addCourse(newCourse: Omit<Course, 'id'>): Promise<Course> {
    const created: Course = {
      ...newCourse,
      id: `crs-${Date.now()}`,
    };
    return Promise.resolve(created);
  },
};
