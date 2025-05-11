
import React from 'react';

interface SimpleLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function SimpleLoadingSpinner({ 
  size = 'md', 
  color = '#4CAF50' 
}: SimpleLoadingSpinnerProps) {
  // Size mapping
  const sizeMap = {
    sm: '24px',
    md: '40px',
    lg: '64px'
  };
  
  const spinnerSize = sizeMap[size];
  
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        display: 'inline-block',
        width: spinnerSize,
        height: spinnerSize,
        borderRadius: '50%',
        border: `4px solid rgba(0, 0, 0, 0.1)`,
        borderTopColor: color,
        animation: 'simple-spinner 1s linear infinite'
      }}
    >
      <style jsx>{`
        @keyframes simple-spinner {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
