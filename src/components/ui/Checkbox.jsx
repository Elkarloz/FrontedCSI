/**
 * Checkbox - Componente de checkbox reutilizable
 * Proporciona checkboxes con estilos consistentes
 */

import React from 'react';

const Checkbox = ({
  name,
  value,
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'w-4 h-4 text-cyan-400 bg-black/50 border border-[#00f0ff]/30 rounded focus:ring-2 focus:ring-cyan-400/20 focus:ring-offset-0';
  
  const checkboxClasses = `
    ${baseClasses}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim();
  
  return (
    <label className={`flex items-center space-x-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={checkboxClasses}
        {...props}
      />
      {label && (
        <span className="text-white font-mono text-sm">{label}</span>
      )}
    </label>
  );
};

export default Checkbox;
