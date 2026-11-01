import { mockCourses, mockDepartments } from '@/data/mockData';
/**
 * Course Service Abstraction Layer
 * Communicates with Next.js Route Handlers (/api/courses, /api/courses/[id])
 * backed by live MongoDB database with seamless fallback.
 */
export const courseService = {
    async getCourses(department, search) {
        try {
            if (typeof window !== 'undefined') {
                const params = new URLSearchParams();
                if (department && department !== 'All')
                    params.append('department', department);
                if (search)
                    params.append('search', search);
                const url = `/api/courses${params.toString() ? `?${params.toString()}` : ''}`;
                const res = await fetch(url, { cache: 'no-store' });
                if (res.ok) {
                    const json = await res.json();
                    if (json && Array.isArray(json.data)) {
                        return json.data;
                    }
                }
            }
        }
        catch (err) {
            console.warn('Backend API fetch error, utilizing fallback dataset:', err);
        }
        let list = [...mockCourses];
        if (department && department !== 'All') {
            list = list.filter((c) => c.departmentName.toLowerCase().includes(department.toLowerCase()));
        }
        return Promise.resolve(list);
    },
    async getCourseById(id) {
        try {
            if (typeof window !== 'undefined') {
                const res = await fetch(`/api/courses/${encodeURIComponent(id)}`, { cache: 'no-store' });
                if (res.ok) {
                    const json = await res.json();
                    if (json && json.data) {
                        return json.data;
                    }
                }
            }
        }
        catch (err) {
            console.warn('Error fetching course by ID:', err);
        }
        const courses = await this.getCourses();
        return courses.find((c) => c.id === id || c.code.toLowerCase() === id.toLowerCase()) ||
            mockCourses.find((c) => c.id === id || c.code.toLowerCase() === id.toLowerCase());
    },
    async getDepartments() {
        return Promise.resolve([...mockDepartments]);
    },
    async addCourse(newCourse) {
        try {
            if (typeof window !== 'undefined') {
                const res = await fetch('/api/courses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newCourse),
                });
                const json = await res.json();
                if (!res.ok || !json.success) {
                    throw new Error(json.error || 'Failed to create course');
                }
                return json.data;
            }
        }
        catch (err) {
            console.warn('API POST failed:', err);
            throw err;
        }
        const created = {
            ...newCourse,
            id: `crs-${Date.now()}`,
        };
        return Promise.resolve(created);
    },
    async updateCourse(id, updates) {
        try {
            if (typeof window !== 'undefined') {
                const res = await fetch(`/api/courses/${encodeURIComponent(id)}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updates),
                });
                const json = await res.json();
                if (!res.ok || !json.success) {
                    throw new Error(json.error || 'Failed to update course');
                }
                return json.data;
            }
        }
        catch (err) {
            console.warn('API PUT failed:', err);
            throw err;
        }
        return Promise.resolve({ ...mockCourses[0], ...updates, id });
    },
    async deleteCourse(id) {
        try {
            if (typeof window !== 'undefined') {
                const res = await fetch(`/api/courses/${encodeURIComponent(id)}`, {
                    method: 'DELETE',
                });
                const json = await res.json();
                if (!res.ok || !json.success) {
                    throw new Error(json.error || 'Failed to delete course');
                }
                return true;
            }
        }
        catch (err) {
            console.warn('API DELETE failed:', err);
            throw err;
        }
        return true;
    },
};
