import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../utils/cn';
import { IconX } from '../../icons';
import { drawerVariants } from '../../../utils/motion';

export const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  anchor = 'right', // 'left' | 'right'
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className,
  ...props
}) => {
  const drawerRef = useRef(null);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, closeOnEsc]);

  // Handle Focus
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const focusable = drawerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const anchorStyles = {
    left: 'left-0 top-0 bottom-0 border-r',
    right: 'right-0 top-0 bottom-0 border-l',
  };

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-1300 flex overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnOverlayClick ? onClose : undefined}
            className="fixed inset-0 bg-gray-900/60 dark:bg-gray-950/80 backdrop-blur-sm"
          />

          {/* Drawer container */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            variants={drawerVariants(anchor)}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'fixed bg-bg-card border-border-light shadow-2xl flex flex-col h-full w-full focus:outline-none z-10 overflow-hidden',
              sizes[size] || sizes.md,
              anchorStyles[anchor] || anchorStyles.right,
              className
            )}
            {...props}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-light shrink-0">
              <h2 id="drawer-title" className="font-semibold text-text-primary text-base select-none leading-none">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close drawer"
                className="text-text-muted hover:text-text-primary p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
              >
                <IconX size={16} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 text-sm text-text-secondary leading-relaxed">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-border-light bg-gray-50/50 dark:bg-gray-800/10 flex items-center justify-end gap-3 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Drawer;
