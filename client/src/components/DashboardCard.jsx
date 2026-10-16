import React from 'react';

const DashboardCard = ({
  title,
  value,
  unit,
  icon: Icon,
  subtitle,
  trend,
  color = 'emerald'
}) => {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      accent: 'from-emerald-500/10 to-transparent'
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
      accent: 'from-blue-500/10 to-transparent'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      accent: 'from-indigo-500/10 to-transparent'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      accent: 'from-amber-500/10 to-transparent'
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
      accent: 'from-rose-500/10 to-transparent'
    },
    teal: {
      bg: 'bg-teal-50',
      text: 'text-teal-600',
      border: 'border-teal-100',
      accent: 'from-teal-500/10 to-transparent'
    }
  };

  const c = colorMap[color] || colorMap.emerald;

  return (
    <div
      className={`relative overflow-hidden bg-white rounded-2xl p-5 border ${c.border} shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${c.accent} rounded-bl-full pointer-events-none`} />

      <div className="flex items-center justify-between mb-3 relative">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.text} flex items-center justify-center flex-shrink-0 shadow-sm`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 relative">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value !== undefined && value !== null ? value.toLocaleString() : '0'}
        </span>
        {unit && (
          <span className="text-sm font-medium text-slate-500">{unit}</span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 relative pt-2 border-t border-slate-100">
          <span>{subtitle}</span>
          {trend && (
            <span className="font-semibold text-emerald-600 flex items-center gap-0.5">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
