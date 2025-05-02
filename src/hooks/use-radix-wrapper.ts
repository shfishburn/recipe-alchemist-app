
import React from 'react';
import { Slot } from '@radix-ui/react-slot';

export const useRadixWrapper = () => {
  const RadixWrapper = React.forwardRef<
    HTMLElement,
    { asChild?: boolean; children: React.ReactNode }
  >((props, ref) => {
    const { asChild, children, ...otherProps } = props;
    
    return asChild ? (
      <Slot ref={ref} {...otherProps}>{children}</Slot>
    ) : (
      <>{children}</>
    );
  });
  
  RadixWrapper.displayName = 'RadixWrapper';
  
  return RadixWrapper;
};
