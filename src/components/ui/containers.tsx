
// path: src/components/ui/containers.tsx
// file: containers.tsx
// updated: 2025-05-09 15:20 PM

import React, { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

/**
 * PageContainer handles page-level layout: full height, Navbar positioning,
 * and consistent horizontal gutters & max-width for content.
 */
export function PageContainer({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("min-h-screen flex flex-col", className)}>       
      {children}
    </div>
  );
}

/**
 * Card container with frosted glass styling used across the application
 */
export function GlassCard({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("w-full bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100", className)}>
      {children}
    </div>
  );
}
