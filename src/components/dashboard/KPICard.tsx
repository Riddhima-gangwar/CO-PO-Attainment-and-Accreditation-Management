'use client';

import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  timeframe?: string;
  icon: LucideIcon;
  colorScheme: 'blue' | 'indigo' | 'emerald' | 'amber';
}

const colorStyles = {
  blue: {
    iconBg: 'bg-blue-50 text-blue-600',
    watermark: 'text-blue-600',
  },
  indigo: {
    iconBg: 'bg-indigo-50 text-indigo-600',
    watermark: 'text-indigo-600',
  },
  emerald: {
    iconBg: 'bg-emerald-50 text-emerald-600',
    watermark: 'text-emerald-600',
  },
  amber: {
    iconBg: 'bg-amber-50 text-amber-600',
    watermark: 'text-amber-500',
  },
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  timeframe,
  icon: Icon,
  colorScheme,
}) => {
  const styles = colorStyles[colorScheme];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
      {/* Background Watermark Icon */}
      <div
        className={`absolute top-0 right-0 p-4 opacity-10 ${styles.watermark} group-hover:scale-110 group-hover:opacity-20 transition-all duration-300`}
      >
        <Icon size={64} />
      </div>

      {/* Main Content */}
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
      </div>

      {/* Footer / Trend Indicator */}
      {(change || timeframe) && (
        <div className="mt-4 flex items-center text-sm">
          {change && (
            <span
              className={`flex items-center font-medium ${
                changeType === 'positive'
                  ? 'text-emerald-600'
                  : changeType === 'negative'
                  ? 'text-rose-600'
                  : 'text-amber-600'
              }`}
            >
              {changeType === 'positive' && <ArrowUpRight className="h-4 w-4 mr-1" />}
              {changeType === 'negative' && <ArrowDownRight className="h-4 w-4 mr-1" />}
              {changeType === 'neutral' && <TrendingUp className="h-4 w-4 mr-1" />}
              {change}
            </span>
          )}
          {timeframe && <span className="text-gray-400 ml-2">{timeframe}</span>}
        </div>
      )}
    </div>
  );
};
