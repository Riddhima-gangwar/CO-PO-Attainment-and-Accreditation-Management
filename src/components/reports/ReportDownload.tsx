'use client';

import React, { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';

interface ReportDownloadProps {
  reportTitle: string;
}

export const ReportDownload: React.FC<ReportDownloadProps> = ({ reportTitle }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    }, 800);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
        downloaded
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600 shadow-sm'
      }`}
    >
      {downloaded ? (
        <>
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Exported
        </>
      ) : downloading ? (
        <span>Exporting...</span>
      ) : (
        <>
          <Download className="h-3.5 w-3.5" /> Download
        </>
      )}
    </button>
  );
};
