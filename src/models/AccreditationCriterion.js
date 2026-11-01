import mongoose, { Schema } from 'mongoose';

const SubCriterionSchema = new Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    maxMarks: { type: Number, required: true },
    attainedMarks: { type: Number, required: true, default: 0 },
});

const AccreditationCriterionSchema = new Schema(
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
        subCriteria: [SubCriterionSchema],
    },
    {
        timestamps: true,
    }
);

export const AccreditationCriterion =
    mongoose.models.AccreditationCriterion ||
    mongoose.model('AccreditationCriterion', AccreditationCriterionSchema);

export const ALL_DEFAULT_CRITERIA = [
    {
        criterionNumber: 1,
        code: 'CRIT-1',
        name: 'Vision, Mission and Program Educational Objectives (PEOs)',
        maxMarks: 50,
        attainedMarks: 44,
        percentageScore: 88,
        description: 'Establishment, correlation, and stakeholder involvement in Vision/Mission/PEOs',
        status: 'Compliant',
        subCriteria: [
            { code: '1.1', name: 'State the Vision and Mission of Department and Institute', maxMarks: 10, attainedMarks: 9 },
            { code: '1.2', name: 'Program Educational Objectives (PEOs) formulation & review', maxMarks: 15, attainedMarks: 13 },
            { code: '1.3', name: 'Correlation between PEOs and Mission of Department', maxMarks: 15, attainedMarks: 14 },
            { code: '1.4', name: 'Dissemination among Stakeholders and review mechanism', maxMarks: 10, attainedMarks: 8 },
        ],
    },
    {
        criterionNumber: 2,
        code: 'CRIT-2',
        name: 'Program Curriculum and Teaching-Learning Processes',
        maxMarks: 100,
        attainedMarks: 86,
        percentageScore: 86,
        description: 'Structure, delivery modes, laboratory experience, and continuous assessment',
        status: 'Compliant',
        subCriteria: [
            { code: '2.1', name: 'Program Curriculum Structure & AICTE Model Alignment', maxMarks: 30, attainedMarks: 26 },
            { code: '2.2', name: 'Teaching-Learning Processes, ICT tools & pedagogical innovations', maxMarks: 40, attainedMarks: 35 },
            { code: '2.3', name: 'Quality of CIE Question Papers and Assignment Evaluations', maxMarks: 15, attainedMarks: 13 },
            { code: '2.4', name: 'Student Mentoring System and Remedial Learning Actions', maxMarks: 15, attainedMarks: 12 },
        ],
    },
    {
        criterionNumber: 3,
        code: 'CRIT-3',
        name: 'Course Outcomes (COs) and Program Outcomes (POs)',
        maxMarks: 175,
        attainedMarks: 148,
        percentageScore: 84.6,
        description: 'CO establishment, mapping with PO/PSO, and direct/indirect attainment measurement',
        status: 'Compliant',
        subCriteria: [
            { code: '3.1', name: 'Establish correlation between Courses and POs/PSOs (1-3 scale)', maxMarks: 25, attainedMarks: 22 },
            { code: '3.2', name: 'Attainment of Course Outcomes (80% Direct CIE + ESE benchmarks)', maxMarks: 50, attainedMarks: 42 },
            { code: '3.3', name: 'Attainment of Program Outcomes (POs 1-12 & PSOs 1-2)', maxMarks: 75, attainedMarks: 64 },
            { code: '3.4', name: 'Indirect Survey Evaluation (20% Exit & Stakeholder surveys)', maxMarks: 25, attainedMarks: 20 },
        ],
    },
    {
        criterionNumber: 4,
        code: 'CRIT-4',
        name: 'Students Performance & Placement',
        maxMarks: 100,
        attainedMarks: 78,
        percentageScore: 78,
        description: 'Academic progress, placement ratios, professional society participation',
        status: 'Substantially Compliant',
        subCriteria: [
            { code: '4.1', name: 'Enrolment Ratio and Academic Pass Rates without Backlogs', maxMarks: 30, attainedMarks: 24 },
            { code: '4.2', name: 'Campus Placement, Higher Studies and Entrepreneurship Track', maxMarks: 40, attainedMarks: 31 },
            { code: '4.3', name: 'Professional Society Chapters (IEEE, ACM, CSI) Engagement', maxMarks: 15, attainedMarks: 12 },
            { code: '4.4', name: 'Student Publications, Hackathons and Technical Awards', maxMarks: 15, attainedMarks: 11 },
        ],
    },
    {
        criterionNumber: 5,
        code: 'CRIT-5',
        name: 'Faculty Information and Contributions',
        maxMarks: 200,
        attainedMarks: 172,
        percentageScore: 86,
        description: 'Student-faculty ratio, cadre ratio, qualifications, research and publications',
        status: 'Compliant',
        subCriteria: [
            { code: '5.1', name: 'Student-Faculty Ratio (SFR <= 1:15/1:20) and Cadre Proportion', maxMarks: 40, attainedMarks: 34 },
            { code: '5.2', name: 'Faculty Qualifications (Ph.D. holders) and Retention Ratio', maxMarks: 45, attainedMarks: 39 },
            { code: '5.3', name: 'Faculty Publications (SCI/Scopus), Patents & Sponsored R&D', maxMarks: 60, attainedMarks: 51 },
            { code: '5.4', name: 'FDP Participations, NPTEL/Swayam Certifications and MoUs', maxMarks: 35, attainedMarks: 31 },
            { code: '5.5', name: 'Annual Performance Appraisal System (360 Feedback)', maxMarks: 20, attainedMarks: 17 },
        ],
    },
    {
        criterionNumber: 6,
        code: 'CRIT-6',
        name: 'Facilities and Technical Support',
        maxMarks: 80,
        attainedMarks: 68,
        percentageScore: 85,
        description: 'Classrooms, computing labs, language labs, and licensed software infrastructure',
        status: 'Compliant',
        subCriteria: [
            { code: '6.1', name: 'ICT-enabled Classrooms, Project Laboratories & Equipment', maxMarks: 35, attainedMarks: 30 },
            { code: '6.2', name: 'Dedicated High Performance Computing & Language Labs', maxMarks: 25, attainedMarks: 21 },
            { code: '6.3', name: 'Qualified Technical Support Staff, Safety Standards & Power Backup', maxMarks: 20, attainedMarks: 17 },
        ],
    },
    {
        criterionNumber: 7,
        code: 'CRIT-7',
        name: 'Continuous Improvement',
        maxMarks: 75,
        attainedMarks: 62,
        percentageScore: 82.7,
        description: 'Actions taken on PO/PSO attainment gaps, academic audits, and curriculum upgrades',
        status: 'Compliant',
        subCriteria: [
            { code: '7.1', name: 'Actions taken based on PO/PSO attainment evaluation & gap analysis', maxMarks: 30, attainedMarks: 25 },
            { code: '7.2', name: 'Internal Academic and Administrative Audit (IQAC) implementation', maxMarks: 25, attainedMarks: 21 },
            { code: '7.3', name: 'Continuous Improvement in placement quality and median package', maxMarks: 20, attainedMarks: 16 },
        ],
    },
    {
        criterionNumber: 8,
        code: 'CRIT-8',
        name: 'First Year Academics',
        maxMarks: 50,
        attainedMarks: 42,
        percentageScore: 84,
        description: 'First-year faculty cadre, laboratory setup, and foundational course outcomes',
        status: 'Compliant',
        subCriteria: [
            { code: '8.1', name: 'First Year Student-Faculty Ratio and Faculty Qualifications', maxMarks: 15, attainedMarks: 13 },
            { code: '8.2', name: 'Academic Performance & Pass Percentage in First Year Courses', maxMarks: 25, attainedMarks: 21 },
            { code: '8.3', name: 'Attainment of First Year Course Outcomes & Bridge Courses', maxMarks: 10, attainedMarks: 8 },
        ],
    },
    {
        criterionNumber: 9,
        code: 'CRIT-9',
        name: 'Student Support Systems',
        maxMarks: 50,
        attainedMarks: 45,
        percentageScore: 90,
        description: 'Proctorial mentoring, career counseling, grievance redressal, and extracurriculars',
        status: 'Compliant',
        subCriteria: [
            { code: '9.1', name: 'Mentoring System, Career Counseling and Higher Education Guidance', maxMarks: 20, attainedMarks: 18 },
            { code: '9.2', name: 'Stakeholder Feedback Mechanisms (Students, Alumni, Employers)', maxMarks: 15, attainedMarks: 14 },
            { code: '9.3', name: 'Co-curricular, NSS/NCC and Sports Infrastructure Activities', maxMarks: 15, attainedMarks: 13 },
        ],
    },
];

export async function seedInitialCriteria() {
    const count = await AccreditationCriterion.countDocuments();
    if (count < ALL_DEFAULT_CRITERIA.length) {
        for (const c of ALL_DEFAULT_CRITERIA) {
            await AccreditationCriterion.findOneAndUpdate(
                { criterionNumber: c.criterionNumber },
                { $set: c },
                { upsert: true, returnDocument: 'after' }
            );
        }
        console.log('[Seed] Synchronized all 9 NBA criteria into MongoDB');
    }
}
