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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Action Items & Activity</h2>

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
              <p className="text-sm font-medium text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
              {item.actionText && item.actionHref && (
                <Link
                  href={item.actionHref}
                  className="text-blue-600 text-sm font-medium mt-2 inline-block hover:underline"
                >
                  {item.actionText}
                </Link>
              )}
              {item.timeAgo && (
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
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
