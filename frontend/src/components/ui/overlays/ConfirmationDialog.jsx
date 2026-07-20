import React from 'react';
import { Modal } from './Modal';
import { Button } from '../buttons/Button';
import { IconAlertTriangle, IconInfo, IconCheck } from '../../icons';
import { cn } from '../../../utils/cn';

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone. Please confirm to proceed.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', // 'danger' | 'warning' | 'info' | 'success'
  isLoading = false,
  ...props
}) => {
  const icons = {
    danger: <IconAlertTriangle size={24} className="text-danger-600" />,
    warning: <IconAlertTriangle size={24} className="text-warning-500" />,
    info: <IconInfo size={24} className="text-info-500" />,
    success: <IconCheck size={24} className="text-success-600" />,
  };

  const ringBg = {
    danger: 'bg-danger-600/10 dark:bg-danger-600/20',
    warning: 'bg-warning-500/10 dark:bg-warning-500/20',
    info: 'bg-info-500/10 dark:bg-info-500/20',
    success: 'bg-success-600/10 dark:bg-success-600/20',
  };

  const confirmVariants = {
    danger: 'danger',
    warning: 'primary',
    info: 'primary',
    success: 'success',
  };

  const footer = (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={onClose}
        disabled={isLoading}
      >
        {cancelText}
      </Button>
      <Button
        variant={confirmVariants[type] || 'primary'}
        size="sm"
        loading={isLoading}
        onClick={onConfirm}
      >
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={footer}
      {...props}
    >
      <div className="flex gap-4">
        <div className={cn('p-3 rounded-full shrink-0 h-fit', ringBg[type] || ringBg.danger)}>
          {icons[type] || icons.danger}
        </div>
        <div className="space-y-1">
          <p className="text-text-secondary text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
