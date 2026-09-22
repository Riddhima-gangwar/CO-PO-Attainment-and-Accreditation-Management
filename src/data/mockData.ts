export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Faculty' | 'HOD' | 'Accreditation';
  department: string;
  avatarUrl?: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  hodName: string;
  activeCoursesCount: number;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  departmentId: string;
  departmentName: string;
  semester: number;
  credits: number;
  academicYear: string;
  facultyName: string;
  studentsEnrolled: number;
  coCount: number;
  status: 'In Progress' | 'Completed' | 'Pending Review';
}

export interface CourseOutcome {
  id: string;
  courseId: string;
  code: string; // CO1, CO2
  statement: string;
  bloomLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
  targetAttainment: number; // e.g. 70 (%)
  actualAttainment?: number; // e.g. 74 (%)
}

export interface ProgramOutcome {
  id: string;
  code: string; // PO1, PO2...
  title: string;
  statement: string;
  targetScore: number;
}

export interface COPOMapRecord {
  courseId: string;
  coId: string;
  poId: string;
  correlationLevel: 0 | 1 | 2 | 3; // 0 = '-'
}

export interface COAttainmentData {
  id: string;
  courseId: string;
  coCode: string;
  statement: string;
  targetPercent: number;
  directScore: number; // e.g. 76.5
  indirectScore: number; // e.g. 82.0
  overallAttainment: number; // e.g. 77.6
  attainmentLevel: 1 | 2 | 3;
  status: 'Met' | 'Unmet';
}

export interface ReportItem {
  id: string;
  title: string;
  type: 'NBA SSR' | 'Attainment Register' | 'Course Exit Survey' | 'NAAC Criterion';
  department: string;
  academicYear: string;
  generatedDate: string;
  status: 'Ready' | 'Draft' | 'Archived';
  fileSize: string;
}

// --------------------------------------------------------
// MOCK DATASETS
// --------------------------------------------------------

export const mockUsers: User[] = [
  {
    id: 'usr-1',
    name: 'Dr. Ramesh Sharma',
    email: 'ramesh.sharma@institution.edu',
    role: 'Admin',
    department: 'Computer Science & Engineering',
  },
  {
    id: 'usr-2',
    name: 'Prof. Ananya Gupta',
    email: 'ananya.gupta@institution.edu',
    role: 'Faculty',
    department: 'Computer Science & Engineering',
  },
  {
    id: 'usr-3',
    name: 'Dr. Vivek Verma',
    email: 'vivek.verma@institution.edu',
    role: 'HOD',
    department: 'Computer Science & Engineering',
  },
  {
    id: 'usr-4',
    name: 'Dr. Sunita Mehta',
    email: 'sunita.mehta@institution.edu',
    role: 'Accreditation',
    department: 'Internal Quality Assurance Cell (IQAC)',
  },
];

export const mockDepartments: Department[] = [
  {
    id: 'dept-cse',
    code: 'CSE',
    name: 'Computer Science & Engineering',
    hodName: 'Dr. Vivek Verma',
    activeCoursesCount: 24,
  },
  {
    id: 'dept-ece',
    code: 'ECE',
    name: 'Electronics & Communication Engineering',
    hodName: 'Dr. Preeti Deshmukh',
    activeCoursesCount: 20,
  },
  {
    id: 'dept-mech',
    code: 'MECH',
    name: 'Mechanical Engineering',
    hodName: 'Dr. Rajesh Patel',
    activeCoursesCount: 18,
  },
];

export const mockCourses: Course[] = [
  {
    id: 'crs-1',
    code: 'CS301',
    title: 'Data Structures and Algorithms',
    departmentId: 'dept-cse',
    departmentName: 'Computer Science & Engineering',
    semester: 3,
    credits: 4,
    academicYear: '2025-2026',
    facultyName: 'Prof. Ananya Gupta',
    studentsEnrolled: 68,
    coCount: 5,
    status: 'In Progress',
  },
  {
    id: 'crs-2',
    code: 'CS302',
    title: 'Database Management Systems',
    departmentId: 'dept-cse',
    departmentName: 'Computer Science & Engineering',
    semester: 4,
    credits: 4,
    academicYear: '2025-2026',
    facultyName: 'Dr. Ramesh Sharma',
    studentsEnrolled: 72,
    coCount: 5,
    status: 'Completed',
  },
  {
    id: 'crs-3',
    code: 'CS401',
    title: 'Artificial Intelligence & Machine Learning',
    departmentId: 'dept-cse',
    departmentName: 'Computer Science & Engineering',
    semester: 7,
    credits: 3,
    academicYear: '2025-2026',
    facultyName: 'Dr. Sunita Mehta',
    studentsEnrolled: 64,
    coCount: 4,
    status: 'In Progress',
  },
  {
    id: 'crs-4',
    code: 'EC305',
    title: 'Digital Signal Processing',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication Engineering',
    semester: 5,
    credits: 4,
    academicYear: '2025-2026',
    facultyName: 'Prof. Amit Kulkarni',
    studentsEnrolled: 58,
    coCount: 5,
    status: 'Pending Review',
  },
];

export const mockCourseOutcomes: CourseOutcome[] = [
  {
    id: 'co-1',
    courseId: 'crs-1',
    code: 'CO1',
    statement: 'Analyze algorithmic asymptotic efficiency using Big-O, Omega, and Theta notations.',
    bloomLevel: 'Analyze',
    targetAttainment: 70,
    actualAttainment: 76.4,
  },
  {
    id: 'co-2',
    courseId: 'crs-1',
    code: 'CO2',
    statement: 'Implement and manipulate fundamental linear data structures such as linked lists, stacks, and queues.',
    bloomLevel: 'Apply',
    targetAttainment: 70,
    actualAttainment: 72.8,
  },
  {
    id: 'co-3',
    courseId: 'crs-1',
    code: 'CO3',
    statement: 'Design efficient tree and graph representations for real-world hierarchical and network problems.',
    bloomLevel: 'Create',
    targetAttainment: 65,
    actualAttainment: 68.2,
  },
  {
    id: 'co-4',
    courseId: 'crs-1',
    code: 'CO4',
    statement: 'Apply divide-and-conquer, greedy, and dynamic programming paradigms to computational problems.',
    bloomLevel: 'Apply',
    targetAttainment: 65,
    actualAttainment: 61.5,
  },
  {
    id: 'co-5',
    courseId: 'crs-1',
    code: 'CO5',
    statement: 'Evaluate hashing and collision resolution techniques for performance-critical dictionary operations.',
    bloomLevel: 'Evaluate',
    targetAttainment: 70,
    actualAttainment: 78.0,
  },
];

export const mockProgramOutcomes: ProgramOutcome[] = [
  {
    id: 'po-1',
    code: 'PO1',
    title: 'Engineering Knowledge',
    statement: 'Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems.',
    targetScore: 2.5,
  },
  {
    id: 'po-2',
    code: 'PO2',
    title: 'Problem Analysis',
    statement: 'Identify, formulate, review research literature, and analyze complex engineering problems reaching substantiated conclusions using principles of mathematics, natural sciences, and engineering.',
    targetScore: 2.5,
  },
  {
    id: 'po-3',
    code: 'PO3',
    title: 'Design/Development of Solutions',
    statement: 'Design solutions for complex engineering problems and design system components or processes that meet the specified needs with appropriate consideration for public health, safety, and cultural issues.',
    targetScore: 2.3,
  },
  {
    id: 'po-4',
    code: 'PO4',
    title: 'Conduct Investigations of Complex Problems',
    statement: 'Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of the information to provide valid conclusions.',
    targetScore: 2.2,
  },
  {
    id: 'po-5',
    code: 'PO5',
    title: 'Modern Tool Usage',
    statement: 'Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modeling to complex engineering activities with an understanding of limitations.',
    targetScore: 2.4,
  },
  {
    id: 'po-6',
    code: 'PO6',
    title: 'The Engineer and Society',
    statement: 'Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues and the consequent responsibilities relevant to the professional engineering practice.',
    targetScore: 2.0,
  },
  {
    id: 'po-7',
    code: 'PO7',
    title: 'Environment and Sustainability',
    statement: 'Understand the impact of the professional engineering solutions in societal and environmental contexts, and demonstrate the knowledge of, and need for sustainable development.',
    targetScore: 2.0,
  },
  {
    id: 'po-8',
    code: 'PO8',
    title: 'Ethics',
    statement: 'Apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice.',
    targetScore: 2.5,
  },
  {
    id: 'po-9',
    code: 'PO9',
    title: 'Individual and Team Work',
    statement: 'Function effectively as an individual, and as a member or leader in diverse teams, and in multidisciplinary settings.',
    targetScore: 2.5,
  },
  {
    id: 'po-10',
    code: 'PO10',
    title: 'Communication',
    statement: 'Communicate effectively on complex engineering activities with the engineering community and with society at large, such as being able to comprehend and write effective reports and design documentation.',
    targetScore: 2.5,
  },
  {
    id: 'po-11',
    code: 'PO11',
    title: 'Project Management and Finance',
    statement: 'Demonstrate knowledge and understanding of engineering and management principles and apply these to one’s own work, as a member and leader in a team, to manage projects.',
    targetScore: 2.2,
  },
  {
    id: 'po-12',
    code: 'PO12',
    title: 'Life-long Learning',
    statement: 'Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change.',
    targetScore: 2.4,
  },
];

// Initial correlation matrix for CS301 (crs-1)
export const initialCourseMapping: Record<string, number> = {
  'co-1_po-1': 3,
  'co-1_po-2': 3,
  'co-1_po-3': 2,
  'co-1_po-4': 1,
  'co-1_po-5': 0,
  'co-1_po-12': 2,

  'co-2_po-1': 3,
  'co-2_po-2': 2,
  'co-2_po-3': 3,
  'co-2_po-5': 2,
  'co-2_po-12': 2,

  'co-3_po-1': 2,
  'co-3_po-2': 3,
  'co-3_po-3': 3,
  'co-3_po-4': 2,
  'co-3_po-5': 2,
  'co-3_po-12': 3,

  'co-4_po-1': 3,
  'co-4_po-2': 3,
  'co-4_po-3': 3,
  'co-4_po-4': 2,
  'co-4_po-5': 1,
  'co-4_po-12': 2,

  'co-5_po-1': 2,
  'co-5_po-2': 2,
  'co-5_po-3': 2,
  'co-5_po-5': 2,
  'co-5_po-12': 1,
};

export const mockCOAttainmentList: COAttainmentData[] = [
  {
    id: 'attain-1',
    courseId: 'crs-1',
    coCode: 'CO1',
    statement: 'Analyze algorithmic asymptotic efficiency using Big-O, Omega, and Theta notations.',
    targetPercent: 70,
    directScore: 76.5,
    indirectScore: 82.0,
    overallAttainment: 77.6,
    attainmentLevel: 3,
    status: 'Met',
  },
  {
    id: 'attain-2',
    courseId: 'crs-1',
    coCode: 'CO2',
    statement: 'Implement and manipulate fundamental linear data structures such as linked lists, stacks, and queues.',
    targetPercent: 70,
    directScore: 73.0,
    indirectScore: 78.5,
    overallAttainment: 74.1,
    attainmentLevel: 3,
    status: 'Met',
  },
  {
    id: 'attain-3',
    courseId: 'crs-1',
    coCode: 'CO3',
    statement: 'Design efficient tree and graph representations for real-world hierarchical and network problems.',
    targetPercent: 65,
    directScore: 67.8,
    indirectScore: 70.0,
    overallAttainment: 68.2,
    attainmentLevel: 2,
    status: 'Met',
  },
  {
    id: 'attain-4',
    courseId: 'crs-1',
    coCode: 'CO4',
    statement: 'Apply divide-and-conquer, greedy, and dynamic programming paradigms to computational problems.',
    targetPercent: 65,
    directScore: 60.5,
    indirectScore: 65.0,
    overallAttainment: 61.4,
    attainmentLevel: 1,
    status: 'Unmet',
  },
  {
    id: 'attain-5',
    courseId: 'crs-1',
    coCode: 'CO5',
    statement: 'Evaluate hashing and collision resolution techniques for performance-critical dictionary operations.',
    targetPercent: 70,
    directScore: 78.2,
    indirectScore: 80.0,
    overallAttainment: 78.6,
    attainmentLevel: 3,
    status: 'Met',
  },
];

export const mockReports: ReportItem[] = [
  {
    id: 'rep-1',
    title: 'NBA Tier-I Self Study Report: Criterion 3 (Course Outcomes)',
    type: 'NBA SSR',
    department: 'Computer Science & Engineering',
    academicYear: '2024-2025',
    generatedDate: '2025-11-14',
    status: 'Ready',
    fileSize: '3.4 MB',
  },
  {
    id: 'rep-2',
    title: 'Consolidated Direct & Indirect CO-PO Attainment Register',
    type: 'Attainment Register',
    department: 'Computer Science & Engineering',
    academicYear: '2025-2026',
    generatedDate: '2026-02-18',
    status: 'Ready',
    fileSize: '1.8 MB',
  },
  {
    id: 'rep-3',
    title: 'Program Exit Survey & Stakeholder Indirect Assessment Summary',
    type: 'Course Exit Survey',
    department: 'Computer Science & Engineering',
    academicYear: '2024-2025',
    generatedDate: '2025-06-30',
    status: 'Ready',
    fileSize: '950 KB',
  },
  {
    id: 'rep-4',
    title: 'NAAC Criterion 2: Teaching-Learning and Outcome Evaluation',
    type: 'NAAC Criterion',
    department: 'Institutional (All Departments)',
    academicYear: '2024-2025',
    generatedDate: '2025-10-05',
    status: 'Draft',
    fileSize: '4.2 MB',
  },
];
