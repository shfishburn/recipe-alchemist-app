// path: src/components/ui/containers.tsx
// file: containers.tsx
// created: 2025-05-09 10:55 AM

import React, { PropsWithChildren } from 'react';

/**
 * PageContainer handles page-level layout: full height, Navbar positioning,
 * and consistent horizontal gutters & max-width for content.
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
