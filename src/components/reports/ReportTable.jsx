'use client';
import React from 'react';
import { ReportDownload } from './ReportDownload';
import { FileText, Calendar, Building, Trash2 } from 'lucide-react';

export const ReportTable = ({ reports = [], onDeleteReport }) => {
    // Deduplicate reports by title if any dupes exist in state
    const seen = new Set();
    const uniqueReports = reports.filter((r) => {
        if (!r.title || seen.has(r.title)) return false;
        seen.add(r.title);
        return true;
    });

    if (uniqueReports.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">No Reports Found</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                    No compliance reports match the selected category. Generate a new report using the button above.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">Accreditation Document Manifest</h3>
                <span className="text-xs text-gray-500">{uniqueReports.length} generated documents</span>
            </div>

            <div className="divide-y divide-gray-100">
                {uniqueReports.map((report) => (
                    <div
                        key={report.id || report.title}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                <FileText className="h-5 w-5" />
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-gray-900">{report.title}</h4>
                                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">
                                        {report.type}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Building className="h-3 w-3" /> {report.department}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> Cycle: {report.academicYear}
                                    </span>
                                    <span>Size: {report.fileSize}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 self-end sm:self-center">
                            <span
                                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                                    report.status === 'Ready'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                            >
                                {report.status}
                            </span>
                            <ReportDownload report={report} reportTitle={report.title} />
                            {onDeleteReport && (
                                <button
                                    type="button"
                                    onClick={() => onDeleteReport(report.id, report.title)}
                                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    title={`Delete ${report.title}`}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
