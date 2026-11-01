import { connectToDatabase } from '@/lib/mongodb';
import { seedDefaultUsers } from '@/models/User';
import { seedInitialCourses } from '@/models/Course';
import { seedInitialCOs } from '@/models/CO';
import { seedInitialPOs } from '@/models/PO';
import { seedInitialPSOs } from '@/models/PSO';
import { seedInitialMappings } from '@/models/COPOMap';
import { seedInitialAssessments } from '@/models/Assessment';
import { seedInitialStudents } from '@/models/Student';
import { seedInitialMarks } from '@/models/StudentMark';
import { seedInitialCOAttainment } from '@/models/COAttainment';
import { seedInitialPOAttainment } from '@/models/POAttainment';
import { seedInitialPrograms } from '@/models/Program';
import { seedInitialEvidence } from '@/models/EvidenceDocument';
import { seedInitialCriteria } from '@/models/AccreditationCriterion';
import { seedInitialReports } from '@/models/Report';
let hasSeeded = false;
/**
 * Initializes and seeds all essential OBE collections into MongoDB
 */
export async function ensureDatabaseSeeded() {
    if (hasSeeded)
        return true;
    try {
        await connectToDatabase();
        await Promise.all([
            seedDefaultUsers(),
            seedInitialCourses(),
            seedInitialCOs(),
            seedInitialPOs(),
            seedInitialPSOs(),
            seedInitialMappings(),
            seedInitialAssessments(),
            seedInitialStudents(),
            seedInitialMarks(),
            seedInitialCOAttainment(),
            seedInitialPOAttainment(),
            seedInitialPrograms(),
            seedInitialEvidence(),
            seedInitialCriteria(),
            seedInitialReports(),
        ]);
        hasSeeded = true;
        console.log('[Database] All Outcome360 MongoDB collections initialized successfully.');
        return true;
    }
    catch (error) {
        console.warn('[Database] Database seeding warning (offline or connecting):', error);
        return false;
    }
}
