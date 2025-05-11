
import React from 'react';
import { SimpleErrorDisplay } from '@/components/ui/simple-error-display';

interface ErrorStateProps {
  error: string | null;
  onCancel?: () => void;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorState({ error, onCancel, onRetry, isRetrying = false }: ErrorStateProps) {
  return (
    <SimpleErrorDisplay
      error={error} 
      onRetry={isRetrying ? undefined : onRetry}
      onCancel={onCancel}
    />
  );
}
