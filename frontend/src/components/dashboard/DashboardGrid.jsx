import React from 'react';

export const DashboardGrid = ({ cols = 2, children, className = '' }) => {
  const gridMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  const gridColsClass = gridMap[cols] || gridMap[2];

  return <div className={`grid ${gridColsClass} gap-6 ${className}`}>{children}</div>;
};

export default DashboardGrid;
