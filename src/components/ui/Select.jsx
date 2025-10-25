/**
 * Select - Componente de select reutilizable
 * Proporciona selects con estilos consistentes
 */

import React from 'react';

const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Seleccionar...',
  required = false,
  disabled = false,
  error,
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full px-4 py-3 bg-black/50 border border-[#00f0ff]/30 rounded-lg text-white focus:border-[#00f0ff] focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/20 transition-all duration-300';
  
  const selectClasses = `
    ${baseClasses}
    ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim();
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[#00f0ff]">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-400 text-sm font-mono">{error}</p>
      )}
    </div>
  );
};

export default Select;
