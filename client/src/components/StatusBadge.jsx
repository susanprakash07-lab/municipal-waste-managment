import React from 'react';

const statusConfig = {
  // Operational Statuses
  Completed: { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
  Operational: { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
  'In Progress': { bg: 'bg-sky-100 text-sky-800 border-sky-200', dot: 'bg-sky-500' },
  Processing: { bg: 'bg-indigo-100 text-indigo-800 border-indigo-200', dot: 'bg-indigo-500' },
  Scheduled: { bg: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500' },
  Pending: { bg: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  Maintenance: { bg: 'bg-yellow-100 text-yellow-800 border-yellow-200', dot: 'bg-yellow-500' },
  Cancelled: { bg: 'bg-rose-100 text-rose-800 border-rose-200', dot: 'bg-rose-500' },
  'Temporarily Closed': { bg: 'bg-rose-100 text-rose-800 border-rose-200', dot: 'bg-rose-500' },

  // Landfill Warning Levels
  Normal: { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
  Moderate: { bg: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  High: { bg: 'bg-orange-100 text-orange-800 border-orange-200', dot: 'bg-orange-500' },
  Critical: { bg: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse', dot: 'bg-rose-600' },

  // Roles
  ADMIN: { bg: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-500' },
  'MUNICIPAL STAFF': { bg: 'bg-teal-100 text-teal-800 border-teal-200', dot: 'bg-teal-500' }
};

const StatusBadge = ({ status, className = '' }) => {
  const config = statusConfig[status] || {
    bg: 'bg-slate-100 text-slate-800 border-slate-200',
    dot: 'bg-slate-400'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
