
import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Slot } from '@/components/ui/slot';

interface ButtonWrapperProps extends ButtonProps {
  asChild?: boolean;
}

/**
 * Enhanced ButtonWrapper that safely handles the asChild prop
 * and provides better error handling for child elements
 */
const ButtonWrapper = forwardRef<HTMLButtonElement, ButtonWrapperProps>(
  ({ asChild, className, children, ...props }, ref) => {
    // Handle the case where there are no children
    if (!children) {
      return <Button ref={ref} className={className} {...props} />;
    }
    
    // When asChild is true, use our custom Slot component
    if (asChild) {
      return (
        <Slot
          className={className} 
          {...props}
          ref={ref}
        >
          {children}
        </Slot>
      );
    }
    
    // Regular button when asChild is false
    return <Button ref={ref} className={className} {...props}>{children}</Button>;
  }
);

ButtonWrapper.displayName = 'ButtonWrapper';

export { ButtonWrapper };
