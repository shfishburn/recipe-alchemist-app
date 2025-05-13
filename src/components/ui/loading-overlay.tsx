
import React from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from '@/lib/utils';
import '@/styles/loading.css';

const loadingOverlayVariants = cva(
  "fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300",
  {
    variants: {
      isOpen: {
        true: "opacity-100 pointer-events-auto",
        false: "opacity-0 pointer-events-none",
      },
    },
    defaultVariants: {
      isOpen: false,
    },
  }
);

const loadingContentVariants = cva(
  "bg-white dark:bg-gray-800 rounded-lg shadow-lg transform transition-all duration-300",
  {
    variants: {
      isOpen: {
        true: "scale-100 opacity-100",
        false: "scale-95 opacity-0",
      },
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
      },
    },
    defaultVariants: {
      isOpen: false,
      size: "md",
    },
  }
);

interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement>, 
  VariantProps<typeof loadingOverlayVariants>, 
  VariantProps<typeof loadingContentVariants> {
  children?: React.ReactNode;
  showSpinner?: boolean;
}

const LoadingOverlay = ({
  children,
  className,
  isOpen = false,
  size = "md",
  showSpinner = true,
  ...props
}: LoadingOverlayProps) => {
  return (
    <div
      className={cn(loadingOverlayVariants({ isOpen }))}
      aria-hidden={!isOpen}
      {...props}
    >
      <div 
        className={cn(
          loadingContentVariants({ isOpen, size }),
          className
        )}
      >
        {showSpinner && (
          <div className="flex justify-center p-4">
            <div className="relative w-12 h-12">
              <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
              <div className="absolute top-0 w-12 h-12 rounded-full border-4 border-recipe-green border-t-transparent animate-spin"></div>
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default LoadingOverlay;
