// path: src/components/ui/containers.tsx
// file: containers.tsx
// updated: 2025-05-09 14:30 PM

import React, { PropsWithChildren } from 'react';

/**
 * PageContainer handles page-level layout:
 * - Full-height flex structure
 * - Global horizontal gutters and centering
 * - Consistent max-width for content
 */
export function PageContainer({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <main className="flex-1 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        {children}
      </main>
    </div>
  );
}
