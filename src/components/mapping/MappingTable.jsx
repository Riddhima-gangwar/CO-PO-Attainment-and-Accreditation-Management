'use client';
import React from 'react';
import Link from 'next/link';
import { Target, Plus } from 'lucide-react';

export const MappingTable = ({ cos = [], pos = [], mappings = {}, onCellClick }) => {
    // Natural numerical sort for Program Outcomes (PO1 ... PO12)
    const sortedPOs = [...pos].sort((a, b) => {
        const numA = parseInt(a.code.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.code.replace(/\D/g, ''), 10) || 0;
        return numA - numB;
    });

    // Helper to retrieve correlation score with robust fallback across keys
    const getCorrelation = (co, po) => {
        if (!mappings) return 0;
        const keys = [
            `${co.id}_${po.id}`,
            `${co.code}_${po.code}`,
            `${co.code.toLowerCase()}_${po.code.toLowerCase()}`,
            `${co.id}_${po.code}`,
            `${co.code}_${po.id}`,
        ];
        for (const k of keys) {
            if (mappings[k] !== undefined && mappings[k] !== null) {
                return Number(mappings[k]);
            }
        }
        return 0;
    };

    // Calculate average correlation per PO
    const calculatePOAverage = (po) => {
        let sum = 0;
        let count = 0;
        cos.forEach((co) => {
            const val = getCorrelation(co, po);
            if (val > 0) {
                sum += val;
                count++;
            }
        });
        return count > 0 ? (sum / count).toFixed(2) : '-';
    };

    const getScoreBadge = (score) => {
        switch (score) {
            case 3:
                return 'bg-blue-600 text-white font-bold';
            case 2:
                return 'bg-blue-100 text-blue-800 font-semibold';
            case 1:
                return 'bg-gray-100 text-gray-700 font-medium';
            default:
                return 'bg-transparent text-gray-300';
        }
    };

    // Intuitive empty state when a newly created course has no Course Outcomes defined yet
    if (!cos || cos.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                    <Target className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">
                    No Course Outcomes Defined Yet
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-5">
                    Before you can map CO-PO correlations, you need to define at least one Course Outcome for this course.
                </p>
                <Link
                    href="/course-outcomes"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                    <Plus className="h-4 w-4" /> Define Course Outcomes
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-xs text-center border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                            <th className="py-3 px-4 text-left font-bold text-gray-800 min-w-[200px]">
                                Course Outcomes (CO)
                            </th>
                            {sortedPOs.map((po) => (
                                <th
                                    key={po.id || po.code}
                                    className="py-3 px-2 font-semibold text-gray-700 min-w-[50px] border-l border-gray-100"
                                    title={`${po.code}: ${po.title}`}
                                >
                                    {po.code}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {cos.map((co) => (
                            <tr key={co.id || co.code} className="hover:bg-blue-50/30 transition-colors">
                                <td className="py-3 px-4 text-left font-medium text-gray-800 flex items-center justify-between">
                                    <span className="font-bold text-blue-700">{co.code}</span>
                                    <span className="text-[10px] text-gray-400 max-w-[140px] truncate ml-2" title={co.statement}>
                                        {co.statement}
                                    </span>
                                </td>

                                {sortedPOs.map((po) => {
                                    const score = getCorrelation(co, po);
                                    return (
                                        <td key={po.id || po.code} className="py-2 px-1 border-l border-gray-100">
                                            <button
                                                type="button"
                                                onClick={() => onCellClick(co.id, po.id, co.code, po.code)}
                                                className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center transition-all cursor-pointer hover:ring-2 hover:ring-blue-400 select-none ${getScoreBadge(score)}`}
                                                title={`Click to cycle correlation (Current: ${score || 'None'})`}
                                            >
                                                {score > 0 ? score : '—'}
                                            </button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}

                        {/* Average Correlation Row */}
                        <tr className="bg-gray-50/80 font-bold border-t-2 border-gray-200 text-gray-800">
                            <td className="py-3 px-4 text-left">Average PO Correlation</td>
                            {sortedPOs.map((po) => (
                                <td key={po.id || po.code} className="py-3 px-1 border-l border-gray-100 text-blue-700">
                                    {calculatePOAverage(po)}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Matrix Correlation Legend */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-700">Correlation Scale:</span>
                    <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                            3
                        </span>
                        <span>High (Substantial)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-blue-100 text-blue-800 font-semibold flex items-center justify-center text-[10px]">
                            2
                        </span>
                        <span>Medium (Moderate)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-gray-100 text-gray-700 font-medium flex items-center justify-center text-[10px]">
                            1
                        </span>
                        <span>Low (Slight)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-gray-400 font-bold text-sm">—</span>
                        <span>No Correlation (0)</span>
                    </div>
                </div>

                <span className="text-gray-400 text-[11px]">
                    * Click any cell to cycle through correlation levels (0 → 1 → 2 → 3 → 0)
                </span>
            </div>
        </div>
    );
};
