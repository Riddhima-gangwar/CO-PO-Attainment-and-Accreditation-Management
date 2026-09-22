# CO-PO-Attainment-and-Accreditation-Management (Outcome360)

## CO-PO Attainment & Accreditation Management System

Outcome360 is a full-stack web application designed to provide a centralized platform for managing **Outcome-Based Education (OBE)**, academic outcomes, assessment data, CO-PO/PSO mapping, attainment analysis, accreditation activities, evidence, and academic reports.

The system connects the complete outcome-management lifecycle, starting from defining program and course outcomes, collecting assessment data, calculating attainment, mapping course outcomes with program outcomes, analyzing program-level performance, and maintaining accreditation-related evidence and documentation.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Problem Statement](#problem-statement)
- [Proposed Solution](#proposed-solution)
- [Architecture & Design Overview](#architecture--design-overview)
- [Major Modules](#major-modules)
- [User Roles & Responsibilities](#user-roles--responsibilities)
- [Project Structure](#project-structure)
- [Current Week 5 Implementation Status](#current-week-5-implementation-status)
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
- **Service Layer Abstraction (`src/services/`):** UI components consume asynchronous service contracts rather than coupling to hardcoded endpoints.
- **State Flow & Immutability:** State is localized to the components that own it, with unidirectional props passing and strictly immutable state updates (`[...prev, newItem]`, `prev.map(...)`).
- **Full Architecture Documentation:** See [`docs/architecture.md`](docs/architecture.md) for the detailed component hierarchy, responsibility matrices, and system diagrams.

---

## Major Modules

1. **Dashboard Overview:** Institutional and departmental KPIs, real-time attainment trend charts, and action item feeds.
2. **Course Management:** Course catalog administration, semester/credit allocations, faculty in-charge assignments, and outcome status tracking.
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
│   └── workflow.md                     # Role-based workflows and primary OBE lifecycle sequence
├── public/                             # Static SVGs and public assets
├── src/
│   ├── app/                            # Next.js App Router root
│   │   ├── (auth)/login/               # Authentication placeholder
│   │   ├── (dashboard)/                # Main application routes
│   │   │   ├── layout.tsx              # Shell layout composing Sidebar and Navbar
│   │   │   ├── dashboard/page.tsx      # Dashboard view (KPIs, Charts, Activity)
│   │   │   ├── courses/page.tsx        # Course management view
│   │   │   ├── course-outcomes/page.tsx# CO formulation view
│   │   │   ├── program-outcomes/page.tsx# PO catalog view
│   │   │   ├── co-po-mapping/page.tsx  # CO-PO mapping matrix view
│   │   │   ├── co-attainment/page.tsx  # Attainment calculation view
│   │   │   └── reports/page.tsx        # Accreditation reports view
│   │   ├── api/                        # Next.js route handlers (backend stubs)
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
│       ├── courseService.ts            # Course and department data operations
│       ├── outcomeService.ts           # CO, PO, and CO-PO mapping operations
│       └── attainmentService.ts        # Attainment and report data operations
├── package.json
├── tsconfig.json
└── README.md
```

---

## Current Week 5 Implementation Status

- **Status:** **Week 5 Architecture & Design Foundation Completed (5/5 Marks Criteria Satisfied)**
- **Accomplishments:**
  - Complete decomposition of monolithic components into modular functional React components.
  - Interactive, demonstrable UI with realistic OBE mock datasets.
  - Formalized Core Data Entities (`docs/data-model.md`) and System Workflows (`docs/workflow.md`).
  - Formalized System Architecture, Component Tree, and Immutability Approach (`docs/architecture.md`).
  - Clean service abstraction layer ready for backend integration in subsequent sprints.
- **Scope Note for Evaluator:** In accordance with the Week 5 evaluation parameters, live database connectivity, authentication/password handling, and production backend APIs are planned for upcoming evaluation milestones.

---

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Library:** React 19 (Functional Components, Hooks)
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

---

## Documentation Index

- [Architecture & Design Specification](docs/architecture.md)
- [Core Data Entities & ER Model](docs/data-model.md)
- [Product Workflows & OBE Lifecycle](docs/workflow.md)
