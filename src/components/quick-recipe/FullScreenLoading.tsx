
import React from 'react';
import LoadingInterstitial from '@/components/recipe-builder/LoadingInterstitial';

export interface FullScreenLoadingProps {
  onCancel?: () => void;
  onRetry?: () => void;
  error?: string | null;
}

export function FullScreenLoading({ onCancel, onRetry, error }: FullScreenLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingInterstitial
        isOpen={true}
        onCancel={onCancel}
        onRetry={onRetry}
        error={error}
      />
    </div>
  );
}
