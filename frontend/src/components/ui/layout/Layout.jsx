import React from 'react';
import { cn } from '../../../utils/cn';

// CONTAINER
export const Container = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    >
      {children}
    </div>
  );
});
Container.displayName = 'Container';

// SECTION
export const Section = React.forwardRef(({ className, children, py = 'md', ...props }, ref) => {
  const pyClasses = {
    none: 'py-0',
    sm: 'py-4 sm:py-6',
    md: 'py-8 sm:py-12',
    lg: 'py-12 sm:py-20',
  };
  return (
    <section
      ref={ref}
      className={cn(pyClasses[py] || pyClasses.md, className)}
      {...props}
    >
      {children}
    </section>
  );
});
Section.displayName = 'Section';

// GRID
export const Grid = React.forwardRef(({
  className,
  children,
  cols = 1,
  colsSm,
  colsMd,
  colsLg,
  gap = 4,
  ...props
}, ref) => {
  const colClasses = {
    1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4',
    5: 'grid-cols-5', 6: 'grid-cols-6', 7: 'grid-cols-7', 8: 'grid-cols-8',
    12: 'grid-cols-12',
  };
  const smClasses = { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4', 12: 'sm:grid-cols-12' };
  const mdClasses = { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4', 12: 'md:grid-cols-12' };
  const lgClasses = { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 12: 'lg:grid-cols-12' };
  
  const gapClasses = {
    0: 'gap-0', 1: 'gap-1', 2: 'gap-2', 3: 'gap-3', 4: 'gap-4',
    6: 'gap-6', 8: 'gap-8', 12: 'gap-12',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'grid',
        colClasses[cols] || 'grid-cols-1',
        colsSm && (smClasses[colsSm] || `sm:grid-cols-${colsSm}`),
        colsMd && (mdClasses[colsMd] || `md:grid-cols-${colsMd}`),
        colsLg && (lgClasses[colsLg] || `lg:grid-cols-${colsLg}`),
        gapClasses[gap] || `gap-${gap}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Grid.displayName = 'Grid';

// STACK
export const Stack = React.forwardRef(({
  className,
  children,
  direction = 'col',
  align = 'stretch',
  justify = 'start',
  spacing = 4,
  wrap = false,
  ...props
}, ref) => {
  const dirClasses = {
    col: 'flex-col',
    row: 'flex-row',
    'col-reverse': 'flex-col-reverse',
    'row-reverse': 'flex-row-reverse',
  };
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };
  const gapClasses = {
    0: 'gap-0', 1: 'gap-1', 2: 'gap-2', 3: 'gap-3', 4: 'gap-4',
    5: 'gap-5', 6: 'gap-6', 8: 'gap-8', 10: 'gap-10', 12: 'gap-12',
    16: 'gap-16'
  };

  return (
    <div
      ref={ref}
      className={cn(
        'flex',
        dirClasses[direction] || 'flex-col',
        alignClasses[align] || 'items-stretch',
        justifyClasses[justify] || 'justify-start',
        gapClasses[spacing] || `gap-${spacing}`,
        wrap ? 'flex-wrap' : 'flex-nowrap',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Stack.displayName = 'Stack';

// DIVIDER
export const Divider = React.forwardRef(({ className, orientation = 'horizontal', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-border-light shrink-0',
        orientation === 'horizontal' ? 'h-[1px] w-full my-4' : 'w-[1px] h-full mx-4 self-stretch',
        className
      )}
      {...props}
    />
  );
});
Divider.displayName = 'Divider';

// SPACER
export const Spacer = React.forwardRef(({ className, size = 4, horizontal = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('shrink-0', className)}
      style={horizontal ? { width: `calc(${size} * 4px)` } : { height: `calc(${size} * 4px)` }}
      {...props}
    />
  );
});
Spacer.displayName = 'Spacer';
