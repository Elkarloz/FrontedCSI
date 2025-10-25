/**
 * RadioButton - Componente de radio button reutilizable
 * Proporciona radio buttons con estilos consistentes
 */

import React from 'react';

const RadioButton = ({
  name,
  value,
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'w-4 h-4 text-cyan-400 bg-black/50 border border-[#00f0ff]/30 focus:ring-2 focus:ring-cyan-400/20 focus:ring-offset-0';
  
  const radioClasses = `
    ${baseClasses}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim();
  
  return (
    <label className={`flex items-center space-x-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={radioClasses}
        {...props}
      />
      {label && (
        <span className="text-white font-mono text-sm">{label}</span>
      )}
    </label>
  );
};

export default RadioButton;
