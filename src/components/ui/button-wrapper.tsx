
import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Slot } from '@/components/ui/slot';

interface ButtonWrapperProps extends ButtonProps {
  asChild?: boolean;
}

// Improved ButtonWrapper that properly handles the asChild prop
const ButtonWrapper = forwardRef<HTMLButtonElement, ButtonWrapperProps>(
  ({ asChild, className, children, ...props }, ref) => {
    // When asChild is true, use our custom Slot component directly
    if (asChild) {
      return (
        <Slot
          className={className} 
          ref={ref as React.Ref<HTMLElement>}
          {...props}
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
