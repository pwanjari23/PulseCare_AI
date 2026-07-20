import React from 'react';
import Spinner from '../ui/loading/Spinner';

export const ButtonLoader = ({ className = '' }) => {
  return <Spinner size="sm" className={`text-current ${className}`} />;
};

export default ButtonLoader;
