
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageContainer - Provides consistent outer page structure
 * Controls the max width and horizontal padding of a full page
 */
export function PageContainer({ children, className }: ContainerProps) {
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      className
    )}>
      {children}
    </div>
  );
}

/**
 * ContentContainer - Provides consistent content width
 * Use inside PageContainer to center and constrain content
 */
export function ContentContainer({ children, className }: ContainerProps) {
  return (
    <div className={cn(
      "w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8",
      className
    )}>
      {children}
    </div>
  );
}
