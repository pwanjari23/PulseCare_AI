import React, { useState } from 'react';
import { cn } from '../../../utils/cn';

export const Avatar = React.forwardRef(({
  className,
  src,
  alt = 'Avatar',
  initials = 'P',
  size = 'md',
  status = null, // 'online' | 'offline' | 'away'
  ...props
}, ref) => {
  const [hasError, setHasError] = useState(false);

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-semibold',
  };

  const statusColors = {
    online: 'bg-success-600',
    offline: 'bg-gray-400 dark:bg-gray-600',
    away: 'bg-warning-500',
  };

  const statusSizes = {
    sm: 'w-2 h-2 border-[1.5px]',
    md: 'w-2.5 h-2.5 border-2',
    lg: 'w-3.5 h-3.5 border-2',
  };

  return (
    <div ref={ref} className={cn('relative inline-flex shrink-0', className)} {...props}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full overflow-hidden select-none font-medium',
          sizes[size] || sizes.md,
          src && !hasError
            ? 'bg-transparent border border-border-light'
            : 'bg-primary-500/10 text-primary-600 border border-primary-500/20'
        )}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials.substring(0, 2).toUpperCase()}</span>
        )}
      </div>

      {status && statusColors[status] && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-bg-card',
            statusColors[status],
            statusSizes[size] || statusSizes.md
          )}
        />
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;
