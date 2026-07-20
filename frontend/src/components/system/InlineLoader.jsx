import React from 'react';
import Spinner from '../ui/loading/Spinner';

export const InlineLoader = ({ message = 'Loading...', className = '' }) => {
  return (
    <div className={`flex items-center gap-2 text-secondary-text text-sm font-medium ${className}`}>
      <Spinner size="sm" className="text-medical-600" />
      <span>{message}</span>
    </div>
  );
};

export default InlineLoader;
