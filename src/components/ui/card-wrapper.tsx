
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from "class-variance-authority";
import { Skeleton } from '@/components/ui/skeleton';

// Define card variants using class-variance-authority
const cardVariants = cva(
  "overflow-hidden", 
  {
    variants: {
      size: {
        default: "",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        full: "max-w-full",
      },
      variant: {
        default: "",
        bordered: "border",
        shadow: "shadow-md",
        floating: "shadow-lg hover:shadow-xl transition-shadow duration-200",
        ghost: "bg-transparent border-none shadow-none",
        interactive: "hover:border-primary/50 transition-colors duration-200",
      },
      padding: {
        default: "",
        none: "p-0",
        sm: "",
        md: "",
        lg: "",
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default",
      padding: "default"
    }
  }
);

export interface CardWrapperProps extends 
  React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cardVariants> {
  /**
   * Card title
   */
  title?: React.ReactNode;
  
  /**
   * Card subtitle or description
   */
  description?: React.ReactNode;
  
  /**
   * Content to show in the footer
   */
  footerContent?: React.ReactNode;
  
  /**
   * Header action component (e.g., button, menu)
   */
  headerAction?: React.ReactNode;
  
  /**
   * If true, renders a skeleton loader
   */
  isLoading?: boolean;
  
  /**
   * Custom className for the Card component
   */
  cardClassName?: string;
  
  /**
   * Custom className for the CardHeader
   */
  headerClassName?: string;
  
  /**
   * Custom className for the CardContent
   */
  contentClassName?: string;
  
  /**
   * Custom className for the CardFooter
   */
  footerClassName?: string;
}

/**
 * CardWrapper component for standardized card layouts
 */
export const CardWrapper = ({
  title,
  description,
  footerContent,
  headerAction,
  isLoading = false,
  size,
  variant,
  padding,
  className,
  cardClassName,
  headerClassName,
  contentClassName,
  footerClassName,
  children,
  ...props
}: CardWrapperProps) => {
  const hasHeader = !!title || !!description || !!headerAction;
  const hasFooter = !!footerContent;
  
  // For skeleton loading state
  if (isLoading) {
    return (
      <Card className={cn(cardVariants({ size, variant, padding }), cardClassName, className)} {...props}>
        {hasHeader && (
          <CardHeader className={cn(headerClassName)}>
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                {title && <Skeleton className="h-6 w-1/2" />}
                {description && <Skeleton className="h-4 w-3/4" />}
              </div>
              {headerAction && <Skeleton className="h-8 w-20" />}
            </div>
          </CardHeader>
        )}
        <CardContent className={cn("space-y-4", contentClassName)}>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </CardContent>
        {hasFooter && (
          <CardFooter className={cn(footerClassName)}>
            <Skeleton className="h-8 w-full" />
          </CardFooter>
        )}
      </Card>
    );
  }
  
  // Normal render
  return (
    <Card className={cn(cardVariants({ size, variant, padding }), cardClassName, className)} {...props}>
      {hasHeader && (
        <CardHeader className={cn(headerClassName)}>
          <div className="flex justify-between items-start">
            <div>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            {headerAction}
          </div>
        </CardHeader>
      )}
      <CardContent className={cn(contentClassName)}>
        {children}
      </CardContent>
      {hasFooter && (
        <CardFooter className={cn(footerClassName)}>
          {footerContent}
        </CardFooter>
      )}
    </Card>
  );
};

export default CardWrapper;
