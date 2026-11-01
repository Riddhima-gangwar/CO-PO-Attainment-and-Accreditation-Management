import { mockCOAttainmentList, mockReports, } from '@/data/mockData';
/**
 * Attainment & Reporting Service Abstraction Layer
 * Encapsulates operations for direct/indirect attainment, student marks, and accreditation reports.
 * Connects directly to Next.js API route handlers backed by MongoDB.
 */
export const attainmentService = {
    async getCOAttainment(courseId) {
        try {
            if (typeof window !== 'undefined') {
                const url = courseId
                    ? `/api/attainment/co?courseId=${encodeURIComponent(courseId)}`
                    : '/api/attainment/co';
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
            console.warn('API fetch for CO attainment failed, falling back:', err);
        }
        if (!courseId)
            return Promise.resolve([...mockCOAttainmentList]);
        return Promise.resolve(mockCOAttainmentList.filter((a) => a.courseId === courseId));
    },
    async getPOAttainment(programId) {
        try {
            if (typeof window !== 'undefined') {
                const url = programId
                    ? `/api/attainment/po?programId=${encodeURIComponent(programId)}`
                    : '/api/attainment/po';
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
            console.warn('API fetch for PO attainment failed:', err);
        }
        return Promise.resolve([
            { id: 'po-1', poCode: 'PO1', title: 'Engineering Knowledge', targetScore: 2.5, directAttainment: 2.65, indirectAttainment: 2.7, overallAttainment: 2.66, status: 'Met', academicYear: '2025-2026' },
            { id: 'po-2', poCode: 'PO2', title: 'Problem Analysis', targetScore: 2.5, directAttainment: 2.52, indirectAttainment: 2.6, overallAttainment: 2.54, status: 'Met', academicYear: '2025-2026' },
            { id: 'po-3', poCode: 'PO3', title: 'Design/Development of Solutions', targetScore: 2.3, directAttainment: 2.38, indirectAttainment: 2.45, overallAttainment: 2.39, status: 'Met', academicYear: '2025-2026' },
            { id: 'po-4', poCode: 'PO4', title: 'Conduct Investigations', targetScore: 2.2, directAttainment: 2.15, indirectAttainment: 2.2, overallAttainment: 2.16, status: 'Unmet', academicYear: '2025-2026' },
            { id: 'po-5', poCode: 'PO5', title: 'Modern Tool Usage', targetScore: 2.4, directAttainment: 2.48, indirectAttainment: 2.55, overallAttainment: 2.49, status: 'Met', academicYear: '2025-2026' },
        ]);
    },
    async getReports(type) {
        try {
            if (typeof window !== 'undefined') {
                const url = type && type !== 'All' ? `/api/reports?type=${encodeURIComponent(type)}` : '/api/reports';
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
            console.warn('API fetch for reports failed, falling back:', err);
        }
        let list = [...mockReports];
        if (type && type !== 'All') {
            list = list.filter((r) => r.type.toLowerCase().includes(type.toLowerCase()));
        }
        return Promise.resolve(list);
    },
    async generateReport(reportData) {
        try {
            if (typeof window !== 'undefined') {
                const res = await fetch('/api/reports', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reportData),
                });
                const json = await res.json();
                if (!res.ok || !json.success) {
                    throw new Error(json.error || 'Failed to generate report');
                }
                return json.data;
            }
        }
        catch (err) {
            console.warn('API generate report failed:', err);
            throw err;
        }
        return Promise.resolve({
            id: `rep-${Date.now()}`,
            title: reportData.title,
            type: reportData.type,
            department: reportData.department || 'Computer Science & Engineering',
            academicYear: '2025-2026',
            generatedDate: new Date().toISOString().split('T')[0],
            status: 'Ready',
            fileSize: '2.8 MB',
        });
    },
    async deleteReport(id) {
        try {
            if (typeof window !== 'undefined') {
                const res = await fetch(`/api/reports?id=${encodeURIComponent(id)}`, {
                    method: 'DELETE',
                });
                const json = await res.json();
                if (!res.ok || !json.success) {
                    throw new Error(json.error || 'Failed to delete report');
                }
                return true;
            }
        }
        catch (err) {
            console.warn('API delete report failed:', err);
            throw err;
        }
        return Promise.resolve(true);
    },
    async getAssessments(courseId) {
        try {
            if (typeof window !== 'undefined') {
                const url = courseId ? `/api/assessments?courseId=${encodeURIComponent(courseId)}` : '/api/assessments';
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
            console.warn('API fetch assessments failed:', err);
        }
        return Promise.resolve([]);
    },
    async addAssessment(assessmentData) {
        try {
            if (typeof window !== 'undefined') {
                const res = await fetch('/api/assessments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(assessmentData),
                });
                const json = await res.json();
                if (!res.ok || !json.success) {
                    throw new Error(json.error || 'Failed to add assessment');
                }
                return json.data;
            }
        }
        catch (err) {
            console.warn('API add assessment failed:', err);
            throw err;
        }
        return Promise.resolve({
            id: `asm-${Date.now()}`,
            courseId: assessmentData.courseId || 'crs-1',
            type: assessmentData.type || 'CIE_1',
            title: assessmentData.title || 'Continuous Internal Evaluation',
            maxMarks: assessmentData.maxMarks || 50,
            weightage: assessmentData.weightage || 20,
        });
    },
    async getStudentMarks(courseId, coCode) {
        try {
            if (typeof window !== 'undefined') {
                const params = new URLSearchParams();
                if (courseId)
                    params.append('courseId', courseId);
                if (coCode)
                    params.append('coCode', coCode);
                const res = await fetch(`/api/marks?${params.toString()}`, { cache: 'no-store' });
                if (res.ok) {
                    const json = await res.json();
                    if (json && Array.isArray(json.data)) {
                        return json.data;
                    }
                }
            }
        }
        catch (err) {
            console.warn('API fetch marks failed:', err);
        }
        return Promise.resolve([]);
    },
    async recordStudentMarks(courseId, assessmentId, marks) {
        try {
            if (typeof window !== 'undefined') {
                const res = await fetch('/api/marks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ courseId, assessmentId, marks }),
                });
                const json = await res.json();
                if (!res.ok || !json.success) {
                    throw new Error(json.error || 'Failed to record student marks');
                }
                return { success: true, message: json.message };
            }
        }
        catch (err) {
            console.warn('API record marks failed:', err);
            throw err;
        }
        return Promise.resolve({ success: true });
    },
};
