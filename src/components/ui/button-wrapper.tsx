
import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { RadixWrapper } from '@/components/ui/radix-wrapper';

interface ButtonWrapperProps extends ButtonProps {
  asChild?: boolean;
}

const ButtonWrapper = forwardRef<HTMLButtonElement, ButtonWrapperProps>(
  ({ asChild, ...props }, ref) => {
    if (asChild) {
      return (
        <RadixWrapper>
          <Button ref={ref} asChild {...props} />
        </RadixWrapper>
      );
    }
    
    return <Button ref={ref} {...props} />;
  }
);

ButtonWrapper.displayName = 'ButtonWrapper';

export { ButtonWrapper };
