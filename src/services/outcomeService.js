import { initialCourseMapping, mockCourseOutcomes, mockProgramOutcomes, } from '@/data/mockData';
/**
 * Outcome Service Abstraction Layer
 * Encapsulates operations for COs, POs, and CO-PO Correlation Mapping matrices.
 * Connects directly to Next.js API route handlers backed by MongoDB.
 */
export const outcomeService = {
    async getCOs(courseId) {
        try {
            if (typeof window !== 'undefined') {
                const url = courseId ? `/api/co?courseId=${encodeURIComponent(courseId)}` : '/api/co';
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
            console.warn('API fetch for COs failed, falling back:', err);
        }
        if (!courseId)
            return Promise.resolve([...mockCourseOutcomes]);
        return Promise.resolve(mockCourseOutcomes.filter((co) => co.courseId === courseId));
    },
    async addCO(newCO) {
        try {
            if (typeof window !== 'undefined') {
                const res = await fetch('/api/co', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newCO),
                });
                const json = await res.json();
                if (!res.ok || !json.success) {
                    throw new Error(json.error || 'Failed to formulate CO');
                }
                return json.data;
            }
        }
        catch (err) {
            console.warn('API POST CO failed:', err);
            throw err;
        }
        const created = {
            ...newCO,
            id: `co-${Date.now()}`,
        };
        return Promise.resolve(created);
    },
    async deleteCO(id) {
        try {
            if (typeof window !== 'undefined') {
                const res = await fetch(`/api/co?id=${encodeURIComponent(id)}`, {
                    method: 'DELETE',
                });
                const json = await res.json();
                if (!res.ok || !json.success) {
                    throw new Error(json.error || 'Failed to delete CO');
                }
                return true;
            }
        }
        catch (err) {
            console.warn('API DELETE CO failed:', err);
            throw err;
        }
        return true;
    },
    async getPOs() {
        try {
            if (typeof window !== 'undefined') {
                const res = await fetch('/api/po', { cache: 'no-store' });
                if (res.ok) {
                    const json = await res.json();
                    if (json && Array.isArray(json.data)) {
                        return json.data;
                    }
                }
            }
        }
        catch (err) {
            console.warn('API fetch for POs failed, falling back:', err);
        }
        return Promise.resolve([...mockProgramOutcomes]);
    },
    async getMapping(courseId) {
        try {
            if (typeof window !== 'undefined') {
                const res = await fetch(`/api/mappings?courseId=${encodeURIComponent(courseId)}`, {
                    cache: 'no-store',
                });
                if (res.ok) {
                    const json = await res.json();
                    if (json && json.data) {
                        return json.data;
                    }
                }
            }
        }
        catch (err) {
            console.warn('API fetch for mapping failed, falling back:', err);
        }
        return Promise.resolve({ ...initialCourseMapping });
    },
    async updateMapping(courseId, mappings) {
        try {
            if (typeof window !== 'undefined') {
                const res = await fetch('/api/mappings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ courseId, mappings }),
                });
                const json = await res.json();
                if (!res.ok || !json.success) {
                    throw new Error(json.error || 'Failed to save mapping matrix');
                }
                return { success: true, message: json.message };
            }
        }
        catch (err) {
            console.warn('API update mapping failed:', err);
            throw err;
        }
        return Promise.resolve({ success: true });
    },
};
