
import React from 'react';
import { Slot } from '@/components/ui/slot';

export const useSlot = () => {
  const SlotWrapper = React.forwardRef<
    HTMLElement,
    { asChild?: boolean; children: React.ReactNode } & React.HTMLAttributes<HTMLElement>
  >((props, ref) => {
    const { asChild, children, ...otherProps } = props;
    
    return asChild ? (
      <Slot ref={ref} {...otherProps}>{children}</Slot>
    ) : (
      <>{children}</>
    );
  });
  
  SlotWrapper.displayName = 'SlotWrapper';
  
  return SlotWrapper;
};
