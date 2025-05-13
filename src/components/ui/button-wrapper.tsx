import React, { forwardRef } from 'react';
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '@/components/ui/button';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ShadcnButtonProps {
  /**
   * If true, the button will show a loading spinner.
   */
  isLoading?: boolean;
  
  /**
   * The text to show when the button is in a loading state.
   */
  loadingText?: string;
  
  /**
   * If true, the child of the button will be treated as a slot.
   * Allows for composition with other components.
   */
  asChild?: boolean;
  
  /**
   * Icon to display at the start of the button.
   */
  startIcon?: React.ReactNode;
  
  /**
   * Icon to display at the end of the button.
   */
  endIcon?: React.ReactNode;
}

/**
 * Enhanced button component with standardized API for loading states and icons
 */
export const ButtonWrapper = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    isLoading = false,
    loadingText,
    disabled,
    asChild = false,
    startIcon,
    endIcon,
    touchFeedback, // Ensure this prop is passed through
    children,
    ...props
  }, ref) => {
    // Determine if the button should be disabled
    const isDisabled = disabled || isLoading;
    
    // Create the button content based on loading state
    const buttonContent = (
      <>
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!isLoading && startIcon && (
          <span className="mr-2">{startIcon}</span>
        )}
        {isLoading && loadingText ? loadingText : children}
        {!isLoading && endIcon && (
          <span className="ml-2">{endIcon}</span>
        )}
      </>
    );
    
    // Use Slot if asChild is true, but pass only the props that Slot accepts
    if (asChild) {
      return (
        <Slot
          className={cn(className)}
          ref={ref as React.Ref<HTMLElement>}
          {...props}
        >
          {buttonContent}
        </Slot>
      );
    }
    
    // Otherwise use ShadcnButton and pass touchFeedback prop
    return (
      <ShadcnButton
        className={cn(className)}
        variant={variant}
        size={size}
        disabled={isDisabled}
        ref={ref}
        touchFeedback={touchFeedback}
        {...props}
      >
        {buttonContent}
      </ShadcnButton>
    );
  }
);

ButtonWrapper.displayName = 'ButtonWrapper';

export default ButtonWrapper;
