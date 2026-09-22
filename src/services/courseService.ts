import { Course, Department, mockCourses, mockDepartments } from '@/data/mockData';

/**
 * Course Service Abstraction Layer
 * Communicates with Next.js Route Handlers (/api/courses) with robust fallback
 * to seed mock data. This demonstrates the Week 5 Frontend -> API -> JSON flow.
 */
export const courseService = {
  async getCourses(department?: string): Promise<Course[]> {
    try {
      // In browser environment, fetch via the live Next.js API route
      if (typeof window !== 'undefined') {
        const url = department && department !== 'All'
          ? `/api/courses?department=${encodeURIComponent(department)}`
          : '/api/courses';

        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(`API responded with status: ${res.status}`);
        }
        const json = await res.json();
        if (json && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn('Backend API fetch error, utilizing fallback seed dataset:', err);
    }

    // SSR or fallback resolution
    let list = [...mockCourses];
    if (department && department !== 'All') {
      list = list.filter((c) =>
        c.departmentName.toLowerCase().includes(department.toLowerCase())
      );
    }
    return Promise.resolve(list);
  },

  async getCourseById(id: string): Promise<Course | undefined> {
    const courses = await this.getCourses();
    return courses.find((c) => c.id === id) || mockCourses.find((c) => c.id === id);
  },

  async getDepartments(): Promise<Department[]> {
    return Promise.resolve([...mockDepartments]);
  },

  async addCourse(newCourse: Omit<Course, 'id'>): Promise<Course> {
    try {
      if (typeof window !== 'undefined') {
        const res = await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCourse),
        });
        if (res.ok) {
          const json = await res.json();
          if (json && json.data) {
            return json.data;
          }
        }
      }
    } catch (err) {
      console.warn('API POST failed, falling back to client-side generation:', err);
    }

    const created: Course = {
      ...newCourse,
      id: `crs-${Date.now()}`,
    };
    return Promise.resolve(created);
  },
};
