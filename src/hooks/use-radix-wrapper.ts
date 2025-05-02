
import React from 'react';
import { Slot } from '@radix-ui/react-slot';

export const useRadixWrapper = () => {
  const RadixWrapper = React.forwardRef<
    HTMLElement,
    { asChild?: boolean; children: React.ReactNode } & React.HTMLAttributes<HTMLElement>
  >((props, ref) => {
    const { asChild, children, ...otherProps } = props;
    
    if (asChild) {
      return <Slot ref={ref} {...otherProps}>{children}</Slot>;
    }
    
    return <>{children}</>;
  });
  
  RadixWrapper.displayName = 'RadixWrapper';
  
  return RadixWrapper;
};
