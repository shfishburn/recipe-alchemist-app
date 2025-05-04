
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function LoadingContainer({ children, className }: LoadingContainerProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-5 sm:py-8 w-full max-w-md mx-auto animate-fadeIn",
      className
    )}>
      <div className="flex flex-col items-center space-y-4 sm:space-y-6 text-center">
        {children}
      </div>
    </div>
  );
}
