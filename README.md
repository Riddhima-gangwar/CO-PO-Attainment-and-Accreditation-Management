# CO-PO-Attainment-and-Accreditation-Management (Outcome360)

## CO-PO Attainment & Accreditation Management System

Outcome360 is a full-stack web application designed to provide a centralized platform for managing **Outcome-Based Education (OBE)**, academic outcomes, assessment data, CO-PO/PSO mapping, attainment analysis, accreditation activities, evidence, and academic reports.

The system connects the complete outcome-management lifecycle, starting from defining program and course outcomes, collecting assessment data, calculating attainment, mapping course outcomes with program outcomes, analyzing program-level performance, and maintaining accreditation-related evidence and documentation.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Problem Statement](#problem-statement)
- [Project Objectives & Scope](#project-objectives--scope)
- [Proposed Solution](#proposed-solution)
- [Architecture & Design Overview](#architecture--design-overview)
- [Major Modules](#major-modules)
- [User Roles & Responsibilities](#user-roles--responsibilities)
- [Project Structure](#project-structure)
- [Current Week 5 Implementation Status](#current-week-5-implementation-status)
- [Week 9 Development Plan](#week-9-development-plan)
- [Week 13 Development Plan](#week-13-development-plan)
- [Team & Member Responsibilities](#team--member-responsibilities)
- [Technology Stack](#technology-stack)
- [Setup & Run Instructions](#setup--run-instructions)
- [Documentation Index](#documentation-index)

---

## About the Project

Educational institutions maintain a large amount of academic and outcome-related information. Program outcomes, course outcomes, assessments, student performance, attainment calculations, course-to-program mappings, accreditation documents, and reports are often maintained using separate spreadsheets, documents, and manual processes.

Outcome360 is designed to bring these activities into one centralized application. Instead of treating academic outcome management, attainment calculation, and accreditation documentation as separate processes, Outcome360 connects them through a single data flow.

The application allows administrators, faculty members, department heads, and accreditation teams to work with the same structured academic data while maintaining appropriate access control.

---

## Problem Statement

Outcome-Based Education requires institutions to continuously measure whether students are achieving expected learning outcomes. In a traditional workflow, this process involves maintaining course outcomes manually, generating complex spreadsheets, manually deriving PO attainment, and assembling paper evidence for accreditation visits.

This causes:
- **Data Fragmentation:** Spreadsheets scattered across faculties and departments.
- **Manual Calculation Errors:** Repeated spreadsheet operations that are error-prone and hard to trace.
- **Difficult Traceability:** Inability to drill down from final accreditation scores to question-level student marks.
- **Time-Consuming Accreditation Audits:** Weeks spent compiling NBA/NAAC compliance binders.

---

## Project Objectives & Scope

### Objectives
1. **Automate Outcome Calculations:** Eliminate manual spreadsheets by computing direct (80%) and indirect (20%) CO attainment and subsequent PO/PSO derivation automatically.
2. **Standardize Curriculum Mapping:** Enforce uniform NBA 1–3 correlation guidelines for CO-PO matrices.
3. **Streamline Accreditation Readiness:** Maintain digital evidence binders and generate NBA Tier-I Self Study Reports (SSR) and NAAC Criterion 2 tables.
4. **Foster Continuous Quality Improvement (CQI):** Provide immediate gap analysis when attainment targets are unmet, prompting faculty corrective action plans.

### Scope
- **In-Scope (Full Lifecycle):** Engineering and higher education degree programs (B.Tech, M.Tech); Course Outcome formulations mapped to Bloom's Revised Taxonomy; Direct CIE and semester exam marks evaluation; Indirect exit surveys; Institutional and departmental analytics.
- **Week 5 Evaluation Scope:** Production of the architectural foundation, complete functional component decomposition, interactive routing, representative API route checkpoint, and primary clickable workflow demonstration.

---

## Proposed Solution

Outcome360 connects academic information directly with assessment and accreditation workflows:

```text
Program
   ↓
PEO / PO / PSO
   ↓
Courses
   ↓
Course Outcomes (CO)
   ↓
Assessments & Student Marks
   ↓
Direct & Indirect CO Attainment
   ↓
CO-PO Correlation Mapping (1, 2, 3)
   ↓
PO & PSO Attainment
   ↓
Performance Gap Analysis & Corrective Actions
   ↓
Accreditation Evidence & SSR Reports
```

---

## Architecture & Design Overview

The application is built using a clean, multi-tier React architecture prioritizing component decomposition, separation of concerns, and immutable data flows:

- **Component Layer (`src/components/`):** Decomposed into modular functional components with strict single-responsibility boundaries (Layout, Dashboard KPIs, Course Catalog, CO/PO Outcomes, Interactive Mapping Matrix, Attainment, and Reports).
- **Service Layer Abstraction (`src/services/`):** UI components consume asynchronous service contracts (`courseService`, `outcomeService`, `attainmentService`) rather than coupling to hardcoded endpoints.
- **State Flow & Immutability:** State is localized to the components that own it, with unidirectional props passing and strictly immutable state updates (`[...prev, newItem]`, `prev.map(...)`).
- **Full Architecture Documentation:** See [`docs/architecture.md`](docs/architecture.md) for the detailed component hierarchy, responsibility matrices, and system diagrams.

---

## Major Modules

1. **Dashboard Overview:** Institutional and departmental KPIs, real-time attainment trend charts, and action item feeds.
2. **Course Management:** Course catalog administration, semester/credit allocations, faculty in-charge assignments, dynamic course detail views (`/courses/[id]`), and outcome status tracking.
3. **Course Outcomes (CO):** Formulation of measurable learning outcomes mapped to Bloom's Revised Taxonomy levels with target attainment benchmarks.
4. **Program Outcomes (PO):** Standard NBA Graduate Attributes (PO1 to PO12) with institutional target levels.
5. **CO-PO Correlation Mapping:** Interactive $M \times N$ correlation matrix with visual weightage badges (1 = Low, 2 = Medium, 3 = High, - = None) and auto-calculated PO correlation averages.
6. **Attainment Calculation:** Computation of direct (80%) and indirect (20%) attainment, NBA Rubric Levels (1, 2, 3), and visual Target vs. Attained progress comparison.
7. **Accreditation Reports & SSR:** Document repository for NBA Self-Study Reports (SSR), AQAR tables, and downloadable compliance summaries.

---

## User Roles & Responsibilities

| Role | Key Responsibilities |
| :--- | :--- |
| **Admin** | Manage users, academic departments, degree programs, course catalogs, and system configuration. |
| **Faculty** | Manage assigned courses, define Course Outcomes (COs), enter assessment marks, and configure CO-PO mapping matrices. |
| **HOD / Coordinator** | Review course outcomes, audit CO-PO mappings, analyze departmental attainment trends, and approve continuous improvement plans. |
| **Accreditation / Management** | Monitor institutional attainment indices, review criteria compliance, audit evidence files, and generate official NBA/NAAC reports. |

---

## Project Structure

```text
CO-PO-Attainment-and-Accreditation-Management/
├── docs/                               # Architecture, Data Model, and Workflow specifications
│   ├── architecture.md                 # System architecture, component tree, and design decisions
│   ├── data-model.md                   # Core entities, fields, relationships, and ER diagram
│   ├── workflow.md                     # Role-based workflows and primary OBE lifecycle sequence
│   └── backlog.md                      # Week 9 and Week 13 planned milestone roadmaps
├── public/                             # Static SVGs and public assets
├── src/
│   ├── app/                            # Next.js App Router root
│   │   ├── (auth)/login/               # Authentication placeholder
│   │   ├── (dashboard)/                # Main application routes
│   │   │   ├── layout.tsx              # Shell layout composing Sidebar and Navbar
│   │   │   ├── dashboard/page.tsx      # Dashboard view (KPIs, Charts, Activity)
│   │   │   ├── courses/page.tsx        # Course catalog view (Search, Filters, Skeleton, Empty/Error)
│   │   │   ├── courses/[id]/page.tsx   # Dynamic Course Details view
│   │   │   ├── course-outcomes/page.tsx# CO formulation view
│   │   │   ├── program-outcomes/page.tsx# PO catalog view
│   │   │   ├── co-po-mapping/page.tsx  # CO-PO mapping matrix view
│   │   │   ├── co-attainment/page.tsx  # Attainment calculation view
│   │   │   └── reports/page.tsx        # Accreditation reports view
│   │   ├── api/                        # Next.js route handlers
│   │   │   └── courses/route.ts        # GET & POST /api/courses representative API endpoint
│   │   ├── globals.css                 # Tailwind CSS v4 design tokens and utilities
│   │   └── page.tsx                    # Root redirect to /dashboard
│   ├── components/                     # Reusable functional React components
│   │   ├── layout/                     # Sidebar, Navbar
│   │   ├── dashboard/                  # KPICard, AttainmentTrendChart, ActivityFeed
│   │   ├── courses/                    # CourseList, CourseForm, CourseDetails
│   │   ├── outcomes/                   # COList, COCard, COForm, POList
│   │   ├── mapping/                    # MappingTable (correlation matrix)
│   │   ├── attainment/                 # AttainmentTable, AttainmentChart
│   │   └── reports/                    # ReportTable, ReportDownload
│   ├── data/                           # Realistic seed / mock datasets
│   │   └── mockData.ts                 # Strongly-typed OBE datasets for local execution
│   ├── models/                         # Mongoose ODM schemas for planned persistence
│   └── services/                       # Asynchronous service layer abstraction
│       ├── courseService.ts            # Course and department data operations (connects to /api/courses)
│       ├── outcomeService.ts           # CO, PO, and CO-PO mapping operations
│       └── attainmentService.ts        # Attainment and report data operations
├── package.json
├── tsconfig.json
└── README.md
```

---

## Current Week 5 Implementation Status

- **Evaluation Milestone:** **Week 5 Foundation Review (25/25 Marks Coverage)**
- **Parameter Breakdown:**
  1. **Architecture & Design (5 Marks):** Formalized component hierarchy, responsibilities table, and system diagrams in [`docs/architecture.md`](docs/architecture.md); identified 11 core data entities in [`docs/data-model.md`](docs/data-model.md); established 4 user roles and workflows in [`docs/workflow.md`](docs/workflow.md).
  2. **React.js Routing & Implementation (5 Marks):** Functional Next.js App Router navigation across `/dashboard`, `/courses`, `/courses/[id]`, `/course-outcomes`, `/program-outcomes`, `/co-po-mapping`, `/co-attainment`, and `/reports`.
  3. **Rendering & Data Fetching (5 Marks):** Dynamic Course Management screen featuring realistic asynchronous data loading, skeleton loading states, empty filter state with reset action, error handling with retry, and immutable state updates.
  4. **Initial Backend & Database Checkpoint (3 Marks):** Functional `GET` & `POST /api/courses` Next.js Route Handler connected to `courseService.ts` demonstrating the `React Component → fetch() → /api/courses → JSON → State → UI` flow; 18 Mongoose ODM models documented in `src/models/`.
  5. **Product Workflow (3 Marks):** Seamlessly clickable end-to-end flow: **Dashboard &rarr; Courses &rarr; Course Details &rarr; Course Outcomes &rarr; CO-PO Mapping &rarr; CO Attainment &rarr; Reports**.
  6. **Documentation (4 Marks):** Comprehensive specifications in `docs/architecture.md`, `docs/data-model.md`, `docs/workflow.md`, `docs/backlog.md`, and complete `README.md`.

---

## Week 9 Development Plan

Planned upcoming milestones for Week 9 (see [`docs/backlog.md`](docs/backlog.md) for full details):
- **Authentication & RBAC:** Implement NextAuth.js / JWT token session management and role guards (Admin, Faculty, HOD, Accreditation).
- **Live Database Integration:** Connect Mongoose models (`Course`, `Program`, `User`) to active MongoDB database instance.
- **Full Course & Outcome CRUD:** Real-time persistence for courses, CO formulation with Bloom's verification, and dynamic PSO definitions.
- **CO-PO Matrix Persistence:** Store matrix correlations in MongoDB with compound indexing and validation rules.
- **Student Assessment Ingestion:** Student roster upload and continuous internal evaluation (CIE) marks entry.

---

## Week 13 Development Plan

Planned final capstone deliverables for Week 13 (see [`docs/backlog.md`](docs/backlog.md) for full details):
- **Advanced Attainment Math Engine:** Automated derivation of PO/PSO attainment using weighted matrix algebra ($80\%$ direct + $20\%$ indirect).
- **Gap Analysis & CQI Loop:** Automated alerts for unmet outcome benchmarks and faculty corrective action submission portal.
- **Accreditation Evidence Management:** Digital course file binder with cloud document storage (AWS S3) for question papers, rubrics, and answer scripts.
- **Automated SSR Generation:** Dynamic PDF/Excel report generator for NBA Tier-I Criterion 3 and NAAC Criterion 2.6.
- **Institutional Analytics:** Multi-year attainment trends and radar charts across all engineering branches.

---

## Technology Stack

- **Framework:** Next.js 16.3.5 (App Router with Turbopack)
- **Library:** React 19.2.8 (Functional Components, Hooks)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React

---

## Setup & Run Instructions

1. **Clone & Navigate to the Project:**
   ```bash
   git clone https://github.com/Riddhima-gangwar/CO-PO-Attainment-and-Accreditation-Management.git
   cd CO-PO-Attainment-and-Accreditation-Management
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. **Access the Application:**
   Open your browser and navigate to `http://localhost:3000`. You will be automatically directed to the interactive Outcome360 Dashboard.

5. **Test the Representative API Endpoint:**
   Visit `http://localhost:3000/api/courses` in your browser or execute:
   ```bash
   curl http://localhost:3000/api/courses
   ```

---

## Documentation Index

- [Architecture & Design Specification](docs/architecture.md)
- [Core Data Entities & ER Model](docs/data-model.md)
- [Product Workflows & OBE Lifecycle](docs/workflow.md)
- [Development Backlog (Week 9 & 13)](docs/backlog.md)
