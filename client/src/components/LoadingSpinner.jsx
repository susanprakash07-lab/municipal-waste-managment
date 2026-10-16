import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading data...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-emerald-600 mb-3`} />
      {message && <p className="text-sm font-medium text-slate-500">{message}</p>}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 6 }) => {
  return (
    <div className="animate-pulse space-y-3 p-4">
      <div className="h-8 bg-slate-200 rounded w-full mb-4"></div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-6 bg-slate-100 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
      </div>
      <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-slate-100 rounded w-2/3"></div>
    </div>
  );
};

export default LoadingSpinner;
