
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// This component is designed to wrap elements used with Radix UI's asChild prop
// to prevent the "React.Children.only expected to receive a single React element child" error

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

const RadixWrapper = forwardRef<HTMLDivElement, WrapperProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn(className)} 
        {...props}
      >
        {children}
      </div>
    );
  }
);

RadixWrapper.displayName = 'RadixWrapper';

export { RadixWrapper };
