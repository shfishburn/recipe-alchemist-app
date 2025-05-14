
import React, { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

/**
 * PageContainer variants based on Material Design layout grid
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
 * PageContainer follows Material Design layout grid system:
 * - 8dp baseline grid for all spacing
 * - 16dp standard gutters on mobile, increasing at larger breakpoints
 * - Consistent max-width for content based on variant
 */
export function PageContainer({ 
  children, 
  className = '', 
  variant = 'default',
  withNavbar = true
}: PageContainerProps) {
  return (
    <div className={cn(
      "flex flex-col w-full overflow-x-hidden mobile-friendly-container",
      className
    )}>
      <main className={cn(
        "flex-1 px-4 sm:px-6 lg:px-8 mx-auto w-full", 
        withNavbar && "pt-20 md:pt-24 lg:pt-28 pb-12",
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
 * using Material Design 8dp grid system
 */
export function ContentSection({ 
  children,
  className = ''
}: PropsWithChildren<{ className?: string }>) {
  return (
    <section className={cn(
      "py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6 w-full overflow-hidden", 
      className
    )}>
      {children}
    </section>
  );
}

/**
 * Material Grid component that implements the Material Design layout grid
 */
interface MaterialGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  spacing?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  container?: boolean;
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export function MaterialGrid({
  children,
  className,
  columns = 12,
  spacing = 4,
  container = false,
  item = false,
  xs,
  sm,
  md,
  lg,
  xl,
  ...props
}: MaterialGridProps) {
  // Calculate spacing class based on the spacing prop
  const spacingClass = `gap-${spacing}`;
  
  // Calculate responsive classes for grid items
  const responsiveClasses = [];
  if (xs !== undefined) responsiveClasses.push(`col-span-${xs}`);
  if (sm !== undefined) responsiveClasses.push(`sm:col-span-${sm}`);
  if (md !== undefined) responsiveClasses.push(`md:col-span-${md}`);
  if (lg !== undefined) responsiveClasses.push(`lg:col-span-${lg}`);
  if (xl !== undefined) responsiveClasses.push(`xl:col-span-${xl}`);
  
  return (
    <div
      className={cn(
        container && `grid grid-cols-${columns} ${spacingClass}`,
        item && responsiveClasses.length > 0 ? responsiveClasses.join(' ') : '',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
