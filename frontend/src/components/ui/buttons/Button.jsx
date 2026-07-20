import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';
import { IconLoader } from '../../icons';

export const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon: LeftIcon = null,
  rightIcon: RightIcon = null,
  fullWidth = false,
  children,
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none';

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm focus-visible:ring-primary-500 border border-transparent',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-text-primary dark:bg-gray-800 dark:hover:bg-gray-700 focus-visible:ring-gray-500 border border-transparent',
    outline: 'bg-transparent border border-border-medium text-text-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 focus-visible:ring-primary-500',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-gray-50 dark:hover:bg-gray-800/30 border border-transparent',
    danger: 'bg-danger-600 hover:bg-danger-700 text-white shadow-sm focus-visible:ring-danger-500 border border-transparent',
    success: 'bg-success-600 hover:bg-success-700 text-white shadow-sm focus-visible:ring-success-500 border border-transparent',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const isBtnDisabled = disabled || loading;

  const content = (
    <>
      {loading && <IconLoader className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {!loading && LeftIcon && <LeftIcon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      <span>{children}</span>
      {!loading && RightIcon && <RightIcon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
    </>
  );

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isBtnDisabled}
      onClick={isBtnDisabled ? undefined : onClick}
      whileTap={isBtnDisabled ? undefined : { scale: 0.98 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className
      )}
      {...props}
    >
      {content}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
