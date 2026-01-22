import React from 'react';
import { cn } from '../../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading,
  disabled,
  ...props 
}) => {
  const variants = {
    primary: "bg-sui-blue-500 hover:bg-sui-blue-400 text-white shadow-lg shadow-sui-blue-500/20 hover:shadow-sui-blue-500/30",
    secondary: "bg-sui-gray-800/50 hover:bg-sui-gray-800 border border-sui-gray-700 hover:border-sui-blue-500/30 text-sui-gray-300 hover:text-sui-blue-300",
    ghost: "bg-transparent hover:bg-sui-gray-800/50 text-sui-gray-300 hover:text-white",
    outline: "border border-sui-gray-700 hover:border-sui-gray-600 text-sui-gray-300"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button 
      className={cn(
        "flex items-center justify-center font-semibold rounded-full transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:translate-y-0",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};
