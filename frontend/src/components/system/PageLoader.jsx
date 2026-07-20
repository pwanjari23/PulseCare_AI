import React from 'react';
import Spinner from '../ui/loading/Spinner';

export const PageLoader = ({ message = 'Loading content...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 w-full">
      <Spinner size="lg" className="text-medical-600" />
      {message && (
        <p className="mt-4 text-sm font-medium text-secondary-text animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default PageLoader;
