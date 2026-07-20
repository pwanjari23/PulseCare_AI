import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../utils/cn';
import {
  IconCheck,
  IconAlertCircle,
  IconAlertTriangle,
  IconInfo,
  IconX
} from '../../icons';

export const Alert = React.forwardRef(({
  className,
  variant = 'info', // 'success' | 'warning' | 'danger' | 'info'
  title,
  description,
  onClose = null,
  showIcon = true,
  children,
  ...props
}, ref) => {
  const [visible, setVisible] = useState(true);

  const icons = {
    info: <IconInfo size={18} className="text-info-500" />,
    success: <IconCheck size={18} className="text-success-600" />,
    warning: <IconAlertCircle size={18} className="text-warning-500" />,
    danger: <IconAlertTriangle size={18} className="text-danger-600" />,
  };

  const colors = {
    info: 'bg-info-500/5 border-info-500/20 text-info-500',
    success: 'bg-success-600/5 border-success-600/20 text-success-600',
    warning: 'bg-warning-500/5 border-warning-500/20 text-warning-500',
    danger: 'bg-danger-600/5 border-danger-600/20 text-danger-600',
  };

  const textColors = {
    info: 'text-text-primary',
    success: 'text-text-primary',
    warning: 'text-text-primary',
    danger: 'text-text-primary',
  };

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className={cn(
            'flex gap-3 p-4 rounded-xl border text-sm leading-relaxed relative overflow-hidden',
            colors[variant] || colors.info,
            className
          )}
          {...props}
        >
          {showIcon && icons[variant] && (
            <div className="shrink-0 pt-0.5">{icons[variant]}</div>
          )}
          <div className="flex-1 min-w-0">
            {title && (
              <h5 className={cn('font-semibold leading-none mb-1 text-sm', textColors[variant] || 'text-text-primary')}>
                {title}
              </h5>
            )}
            {description && (
              <div className="text-xs text-text-secondary">
                {description}
              </div>
            )}
            {children && <div className="text-xs mt-2">{children}</div>}
          </div>
          {onClose && (
            <button
              type="button"
              onClick={handleClose}
              className="shrink-0 p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all self-start"
              aria-label="Close alert"
            >
              <IconX size={14} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

Alert.displayName = 'Alert';

export default Alert;
