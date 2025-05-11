
import React from 'react';
import { SimpleLoadingOverlay } from '@/components/ui/simple-loading-overlay';

interface FullScreenLoadingProps {
  onCancel?: () => void;
  onRetry?: () => void;
  error?: string | null;
}

export function FullScreenLoading({ 
  onCancel, 
  onRetry, 
  error 
}: FullScreenLoadingProps) {
  return (
    <SimpleLoadingOverlay
      isLoading={!error}
      error={error || null}
      onCancel={onCancel}
      onRetry={error ? onRetry : undefined}
      message="Creating your perfect recipe..."
    />
  );
}
