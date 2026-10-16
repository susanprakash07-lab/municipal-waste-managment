import React from 'react';

export const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  step,
  min,
  max,
  helperText,
  className = ''
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        step={step}
        min={min}
        max={max}
        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm ${
          error ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20' : 'border-slate-200'
        } ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
      />
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-400 mt-0.5">{helperText}</p>}
    </div>
  );
};

export const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error,
  disabled = false,
  placeholder = 'Select an option',
  className = ''
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm ${
          error ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200'
        } ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
};

export const TextareaInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  error,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        name={name}
        id={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm ${
          error ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200'
        } ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
      />
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
};
