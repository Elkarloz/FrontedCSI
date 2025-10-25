/**
 * TextArea - Componente de textarea reutilizable
 * Proporciona textareas con estilos consistentes
 */

import React from 'react';

const TextArea = ({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  rows = 4,
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full px-4 py-3 bg-black/50 border border-[#00f0ff]/30 rounded-lg text-white placeholder-gray-400 focus:border-[#00f0ff] focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/20 transition-all duration-300 resize-vertical';
  
  const textareaClasses = `
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
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={textareaClasses}
        {...props}
      />
      {error && (
        <p className="text-red-400 text-sm font-mono">{error}</p>
      )}
    </div>
  );
};

export default TextArea;
