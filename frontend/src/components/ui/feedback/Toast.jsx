import React from 'react';
import { toast as hotToast } from 'react-hot-toast';
import {
  IconCheck,
  IconAlertCircle,
  IconAlertTriangle,
  IconInfo
} from '../../icons';

// Expose a custom toast object with design system styling
export const toast = {
  success: (message, options = {}) => {
    return hotToast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-bg-card border border-success-600/20 shadow-lg rounded-xl pointer-events-auto flex p-4 gap-3 items-start`}
        >
          <div className="shrink-0 p-1 bg-success-600/10 text-success-600 rounded-full">
            <IconCheck size={16} />
          </div>
          <div className="flex-1 text-sm text-text-primary font-medium pr-2 pt-0.5">
            {message}
          </div>
        </div>
      ),
      { duration: 4000, ...options }
    );
  },
  
  error: (message, options = {}) => {
    return hotToast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-bg-card border border-danger-600/20 shadow-lg rounded-xl pointer-events-auto flex p-4 gap-3 items-start`}
        >
          <div className="shrink-0 p-1 bg-danger-600/10 text-danger-600 rounded-full">
            <IconAlertTriangle size={16} />
          </div>
          <div className="flex-1 text-sm text-text-primary font-medium pr-2 pt-0.5">
            {message}
          </div>
        </div>
      ),
      { duration: 5000, ...options }
    );
  },

  warning: (message, options = {}) => {
    return hotToast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-bg-card border border-warning-500/20 shadow-lg rounded-xl pointer-events-auto flex p-4 gap-3 items-start`}
        >
          <div className="shrink-0 p-1 bg-warning-500/10 text-warning-500 rounded-full">
            <IconAlertCircle size={16} />
          </div>
          <div className="flex-1 text-sm text-text-primary font-medium pr-2 pt-0.5">
            {message}
          </div>
        </div>
      ),
      { duration: 4000, ...options }
    );
  },

  info: (message, options = {}) => {
    return hotToast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-bg-card border border-info-500/20 shadow-lg rounded-xl pointer-events-auto flex p-4 gap-3 items-start`}
        >
          <div className="shrink-0 p-1 bg-info-500/10 text-info-500 rounded-full">
            <IconInfo size={16} />
          </div>
          <div className="flex-1 text-sm text-text-primary font-medium pr-2 pt-0.5">
            {message}
          </div>
        </div>
      ),
      { duration: 4000, ...options }
    );
  },

  // Standard passthrough
  custom: hotToast.custom,
  dismiss: hotToast.dismiss,
  loading: hotToast.loading,
};

export default toast;
