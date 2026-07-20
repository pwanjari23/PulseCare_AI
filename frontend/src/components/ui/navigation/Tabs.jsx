import React, { createContext, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

const TabsContext = createContext(null);

export const Tabs = React.forwardRef(({
  className,
  defaultValue,
  value,
  onValueChange,
  children,
  ...props
}, ref) => {
  const [localValue, setLocalValue] = useState(defaultValue);
  const activeValue = value !== undefined ? value : localValue;

  const setActiveValue = (val) => {
    if (value === undefined) {
      setLocalValue(val);
    }
    if (onValueChange) {
      onValueChange(val);
    }
  };

  return (
    <TabsContext.Provider value={{ activeValue, setActiveValue }}>
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
});
Tabs.displayName = 'Tabs';

export const TabsList = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center justify-start border-b border-border-light w-full gap-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
TabsList.displayName = 'TabsList';

export const TabsTrigger = React.forwardRef(({ className, value, children, ...props }, ref) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs component');

  const { activeValue, setActiveValue } = context;
  const isActive = activeValue === value;

  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveValue(value)}
      className={cn(
        'relative py-3 text-sm font-medium text-text-muted hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:text-text-primary focus:ring-0 select-none pb-3.5',
        isActive ? 'text-primary-600 font-semibold' : '',
        className
      )}
      {...props}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeTabUnderline"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </button>
  );
});
TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = React.forwardRef(({ className, value, children, ...props }, ref) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs component');

  const { activeValue } = context;
  const isActive = activeValue === value;

  if (!isActive) return null;

  return (
    <div
      ref={ref}
      role="tabpanel"
      className={cn('py-4 focus-visible:outline-none focus-visible:ring-2', className)}
      {...props}
    >
      {children}
    </div>
  );
});
TabsContent.displayName = 'TabsContent';

export default Tabs;
