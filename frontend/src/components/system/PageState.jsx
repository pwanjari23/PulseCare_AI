import React from 'react';
import PageLoader from './PageLoader';
import ApiErrorState from './ApiErrorState';
import EmptyState from '../ui/feedback/EmptyState';

export const PageState = ({
  isLoading,
  loadingMessage,
  error,
  onRetry,
  isEmpty,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  emptyIcon,
  children
}) => {
  if (isLoading) {
    return <PageLoader message={loadingMessage} />;
  }

  if (error) {
    return <ApiErrorState error={error} onRetry={onRetry} />;
  }

  if (isEmpty) {
    return (
      <EmptyState
        title={emptyTitle || 'No items found'}
        description={emptyDescription || 'There is no data to display in this section.'}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
        icon={emptyIcon}
      />
    );
  }

  return <>{children}</>;
};

export default PageState;
