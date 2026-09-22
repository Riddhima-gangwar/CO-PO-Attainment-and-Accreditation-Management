'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'alert' | 'warning' | 'success';
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  timeAgo?: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'alert',
    title: 'Missing CO-PO Mapping',
    description: 'Computer Science department has 3 courses without mapping.',
    actionText: 'Resolve now →',
    actionHref: '/co-po-mapping',
  },
  {
    id: 'act-2',
    type: 'warning',
    title: 'Evidence Pending Review',
    description: 'Criteria 3.1 documents submitted by Mech. Eng. need approval.',
    actionText: 'Review documents →',
    actionHref: '/accreditation/evidence',
  },
  {
    id: 'act-3',
    type: 'success',
    title: 'Assessment Processed',
    description: 'Mid-term marks for Data Structures (CS301) successfully imported.',
    timeAgo: '2 hours ago',
  },
];

export const ActivityFeed: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(13,27,46,0.12)]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#10243A]">Action Items & Activity</h2>
        <span className="rounded-full bg-[#FFF1E8] px-2.5 py-1 text-xs font-semibold text-[#E66C4D]">3 updates</span>
      </div>

      <div className="space-y-6">
        {mockActivities.map((item) => (
          <div key={item.id} className="flex gap-4">
            {/* Status Icon */}
            <div className="mt-1 shrink-0">
              {item.type === 'alert' && (
                <div className="bg-red-100 p-2 rounded-full text-red-600">
                  <AlertCircle className="h-4 w-4" />
                </div>
              )}
              {item.type === 'warning' && (
                <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                </div>
              )}
              {item.type === 'success' && (
                <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#10243A]">{item.title}</p>
              <p className="mt-1 text-sm text-slate-500">{item.description}</p>
              {item.actionText && item.actionHref && (
                <Link
                  href={item.actionHref}
                  className="mt-2 inline-block text-sm font-semibold text-[#D96B4B] hover:underline"
                >
                  {item.actionText}
                </Link>
              )}
              {item.timeAgo && (
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="h-3 w-3" /> {item.timeAgo}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
