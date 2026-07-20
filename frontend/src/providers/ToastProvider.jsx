import React from 'react';
import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: 'bg-surface text-primary-text border border-border-subtle shadow-xl rounded-2xl p-4 font-sans text-sm font-semibold max-w-md transition-colors duration-300',
        duration: 4000,
        success: {
          iconTheme: {
            primary: 'var(--color-success-600, #16a34a)',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--color-danger-600, #dc2626)',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
};

export default ToastProvider;
