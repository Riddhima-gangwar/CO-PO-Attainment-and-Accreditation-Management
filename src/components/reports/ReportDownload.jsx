'use client';
import React, { useState } from 'react';
import { Download, CheckCircle2, Loader2 } from 'lucide-react';

export const ReportDownload = ({ report, reportTitle }) => {
    const [downloading, setDownloading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);

    const title = report?.title || reportTitle || 'Accreditation Report';
    const type = report?.type || 'NBA SSR';
    const dept = report?.department || 'Computer Science & Engineering';
    const year = report?.academicYear || '2025-2026';
    const date = report?.generatedDate || new Date().toISOString().split('T')[0];
    const status = report?.status || 'Ready';

    const handleDownload = () => {
        setDownloading(true);
        try {
            let content = '';
            let extension = 'txt';
            let mimeType = 'text/plain;charset=utf-8';

            if (type === 'Attainment Register') {
                extension = 'csv';
                mimeType = 'text/csv;charset=utf-8';
                content = `Outcome360 - Consolidated Direct & Indirect CO-PO Attainment Register
Department,${dept}
Academic Cycle,${year}
Status,${status}
Generated Date,${date}

Course Outcome Code,Statement,Bloom Level,Target Attainment %,Direct Score %,Indirect Survey %,Overall Attainment %,Attainment Level,Status
CO1,"Analyze algorithmic asymptotic efficiency using Big-O, Omega, and Theta notations",Analyze,70,76.5,82.0,77.6,3,Met
CO2,"Implement and manipulate fundamental linear data structures",Apply,70,73.0,78.5,74.1,3,Met
CO3,"Design efficient tree and graph representations for real-world problems",Create,65,67.8,70.0,68.2,2,Met
CO4,"Apply divide-and-conquer, greedy, and dynamic programming paradigms",Apply,65,60.5,65.0,61.4,1,Unmet
CO5,"Evaluate hashing and collision resolution techniques",Evaluate,70,78.2,80.0,78.6,3,Met

Program Outcome Attainment Summary
PO Code,Title,Target Score,Direct Attainment,Indirect Attainment,Overall Attainment,Status
PO1,Engineering Knowledge,2.5,2.65,2.70,2.66,Met
PO2,Problem Analysis,2.5,2.52,2.60,2.54,Met
PO3,Design/Development of Solutions,2.3,2.38,2.45,2.39,Met
PO4,Conduct Investigations,2.2,2.15,2.20,2.16,Unmet
PO5,Modern Tool Usage,2.4,2.48,2.55,2.49,Met
PO6,The Engineer and Society,2.0,2.10,2.20,2.12,Met
PO7,Environment and Sustainability,2.0,2.05,2.10,2.06,Met
PO8,Ethics,2.5,2.60,2.65,2.61,Met
PO9,Individual and Team Work,2.5,2.55,2.60,2.56,Met
PO10,Communication,2.5,2.50,2.55,2.51,Met
PO11,Project Management and Finance,2.2,2.25,2.30,2.26,Met
PO12,Life-long Learning,2.4,2.45,2.50,2.46,Met
`;
            } else {
                content = `================================================================================
OUTCOME360 - ACCREDITATION & SSR COMPLIANCE REPORT
================================================================================
Document Title: ${title}
Report Format:  ${type}
Department:     ${dept}
Academic Cycle: ${year}
Generated Date: ${date}
Status:         ${status}
Institution:    Outcome360 Autonomous Institute of Technology
Compliance:     NBA Tier-I & NAAC Criterion-2 Aligned
================================================================================

1. EXECUTIVE SUMMARY
--------------------------------------------------------------------------------
This official compliance report verifies outcome-based education (OBE) metrics
evaluated in accordance with the National Board of Accreditation (NBA) Tier-I
and NAAC Criterion-2 guidelines. All student assessment records, direct Course
Outcome (CO) attainment, indirect survey metrics, and Program Outcome (PO)
correlations have been validated against institutional benchmarks.

2. ATTAINMENT COMPLIANCE OVERVIEW
--------------------------------------------------------------------------------
Benchmark Target Threshold: 70.0%
Institutional Weightage:    80% Direct Assessment + 20% Indirect Surveys
Total Active Courses:       6 Courses Audited
Average CO Attainment:      76.4% (Direct: 76.5%, Indirect: 82.0%)
Overall Status:             COMPLIANT (NBA Criteria 3 Met)

3. CO-PO MATRIX CORRELATIONS SUMMARY
--------------------------------------------------------------------------------
Program Outcomes: PO1 through PO12 fully correlated.
Substantial Correlation (3): 42 Matrix Intersections
Moderate Correlation (2):    28 Matrix Intersections
Slight Correlation (1):      8 Matrix Intersections

4. ACCREDITATION VERIFICATION
--------------------------------------------------------------------------------
Prepared by:    ${report?.generatedBy || 'Institutional OBE Coordinator'}
Verified by:    Head of Department (CSE) / IQAC Director
Institution:    Outcome360 Autonomous Institute of Technology
Date of Export: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
================================================================================
[END OF OFFICIAL OBE REPORT - DIGITALLY VERIFIED]
`;
            }

            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const safeName = title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
            a.href = url;
            a.download = `${safeName}.${extension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setDownloaded(true);
            setTimeout(() => setDownloaded(false), 2500);
        } catch (err) {
            console.error('Failed to download report:', err);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                downloaded
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600 shadow-sm'
            }`}
            title={`Download ${title}`}
        >
            {downloaded ? (
                <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Exported
                </>
            ) : downloading ? (
                <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Exporting...
                </>
            ) : (
                <>
                    <Download className="h-3.5 w-3.5" /> Download
                </>
            )}
        </button>
    );
};
