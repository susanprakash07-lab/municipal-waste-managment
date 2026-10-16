import React from 'react';

const ChartCard = ({
  title,
  subtitle,
  children,
  badge,
  action,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 md:p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-800">{title}</h3>
            {badge && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 leading-normal">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
