
import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Slot } from '@radix-ui/react-slot';

interface ButtonWrapperProps extends ButtonProps {
  asChild?: boolean;
}

// Improved ButtonWrapper that properly handles the asChild prop
const ButtonWrapper = forwardRef<HTMLButtonElement, ButtonWrapperProps>(
  ({ asChild, className, children, ...props }, ref) => {
    // When asChild is true, use Slot directly instead of using RadixWrapper
    if (asChild) {
      return (
        <Slot
          className={className} 
          ref={ref} 
          {...props}
        >
          {React.Children.only(children)}
        </Slot>
      );
    }
    
    // Regular button when asChild is false
    return <Button ref={ref} className={className} {...props}>{children}</Button>;
  }
);

ButtonWrapper.displayName = 'ButtonWrapper';

export { ButtonWrapper };
