
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
      <main className="flex-1 px-6 sm:px-8 lg:px-12 max-w-4xl mx-auto pt-32 md:pt-36 pb-12">
        {children}
      </main>
    </div>
  );
}
