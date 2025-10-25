/**
 * Button - Componente de botón reutilizable
 * Proporciona diferentes variantes y tamaños de botones
 */

import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'font-mono transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-50 disabled:cursor-not-allowed border-0';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#00f0ff] to-[#00ff88] hover:from-[#00ff88] hover:to-[#00f0ff] text-black font-bold shadow-lg hover:shadow-2xl transform hover:scale-105',
    secondary: 'bg-gray-800/50 hover:bg-gray-700/50 text-white',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400',
    ghost: 'bg-transparent hover:bg-gray-700/50 text-gray-300 hover:text-white',
    link: 'bg-transparent text-[#00f0ff] hover:text-[#00ff88] underline-offset-4 hover:underline'
  };
  
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };
  
  // Si el className contiene clases de borde, remover border-0
  const hasBorderClass = className.includes('border-') && !className.includes('border-0');
  const finalBaseClasses = hasBorderClass ? baseClasses.replace('border-0', '') : baseClasses;
  
  const buttonClasses = `
    ${finalBaseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim();
  
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonClasses}
      {...props}
    >
      {loading && (
        <div className="inline-flex items-center mr-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent border-r-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {children}
    </button>
  );
};

export default Button;
