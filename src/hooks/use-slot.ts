
import React from 'react';
import { Slot } from '@/components/ui/slot';

export const useSlot = () => {
  const SlotWrapper = React.forwardRef<
    HTMLElement,
    { asChild?: boolean; children: React.ReactNode } & React.HTMLAttributes<HTMLElement>
  >((props, ref) => {
    const { asChild, children, ...otherProps } = props;
    
    if (asChild) {
      return <Slot ref={ref} {...otherProps}>{children}</Slot>;
    }
    
    return <>{children}</>;
  });
  
  SlotWrapper.displayName = 'SlotWrapper';
  
  return SlotWrapper;
};
