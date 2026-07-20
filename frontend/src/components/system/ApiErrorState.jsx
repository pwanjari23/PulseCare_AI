import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '../ui/buttons/Button';

export const ApiErrorState = ({ error, onRetry }) => {
  const getErrorMessage = () => {
    if (typeof error === 'string') return error;
    return error?.message || 'An unexpected error occurred while communicating with our medical servers.';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px] border border-dashed border-border-subtle rounded-2xl bg-surface/50 max-w-lg mx-auto">
      <div className="p-3 rounded-2xl bg-warning-500/10 text-warning-500 border border-warning-500/20 mb-4">
        <AlertTriangle className="h-8 w-8 animate-pulse" />
      </div>
      <h3 className="font-display font-extrabold text-lg mb-2">Connection Problem</h3>
      <p className="text-sm text-secondary-text mb-6 leading-relaxed max-w-sm">
        {getErrorMessage()}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Retry Request
        </Button>
      )}
    </div>
  );
};

export default ApiErrorState;
