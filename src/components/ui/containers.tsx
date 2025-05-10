
import React, { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

/**
 * PageContainer variants
 * - default: Standard content width with horizontal padding
 * - full: Full width container with minimal padding
 * - narrow: Narrow width for forms and focused content
 */
type ContainerVariant = 'default' | 'full' | 'narrow';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: ContainerVariant;
  withNavbar?: boolean;
}

/**
 * PageContainer handles page-level layout:
 * - Full-height flex structure
 * - Global horizontal gutters and centering
 * - Consistent max-width for content based on variant
 * - Optional top padding for navbar space
 */
export function PageContainer({ 
  children, 
  className = '', 
  variant = 'default',
  withNavbar = true
}: PageContainerProps) {
  return (
    <div className={cn(
      "flex flex-col w-full overflow-hidden mobile-friendly-container",
      className
    )}>
      <main className={cn(
        "flex-1 px-3 sm:px-4 lg:px-6 mx-auto w-full", 
        withNavbar && "pt-24 md:pt-28 pb-12",
        variant === 'default' && "max-w-4xl",
        variant === 'narrow' && "max-w-2xl",
        variant === 'full' && "w-full max-w-7xl"
      )}>
        {children}
      </main>
    </div>
  );
}

/**
 * ContentSection provides consistent vertical spacing within pages
 */
export function ContentSection({ 
  children,
  className = ''
}: PropsWithChildren<{ className?: string }>) {
  return (
    <section className={cn("py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6 w-full overflow-hidden", className)}>
      {children}
    </section>
  );
}
