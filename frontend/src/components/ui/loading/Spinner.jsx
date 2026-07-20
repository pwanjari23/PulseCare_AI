import React from 'react';
import { cn } from '../../../utils/cn';
import { IconLoader } from '../../icons';

export const Spinner = ({
  className,
  size = 'md', // 'sm' | 'md' | 'lg'
  variant = 'primary', // 'primary' | 'secondary' | 'white' | 'muted'
  ...props
}) => {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 36,
  };

  const variants = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-500',
    white: 'text-white',
    muted: 'text-text-muted',
  };

  return (
    <div role="status" className="flex items-center justify-center">
      <IconLoader
        size={sizes[size] || sizes.md}
        className={cn('animate-spin', variants[variant] || variants.primary, className)}
        {...props}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
