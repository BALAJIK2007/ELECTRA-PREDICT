import React from 'react';
import { Zap } from 'lucide-react';

export default function LoadingSpinner({ label = 'Loading analytics...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-blue-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-blue-600">
          <Zap className="w-4 h-4" />
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}
