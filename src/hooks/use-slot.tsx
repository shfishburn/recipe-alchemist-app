
import React from 'react';
import { Slot } from '@/components/ui/slot'; // Import our custom Slot

/**
 * Composes multiple refs into one with improved type safety
 */
const composeRefs = <T extends any>(
  ...refs: Array<React.Ref<T> | undefined | null>
): React.RefCallback<T> => {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
};

export const useSlot = () => {
  const SlotWrapper = React.forwardRef<
    HTMLDivElement,
    { asChild?: boolean; children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
  >((props, ref) => {
    const { asChild, children, ...otherProps } = props;
    
    // When asChild is true, use our custom Slot component
    if (asChild && React.isValidElement(children)) {
      return (
        <Slot ref={ref} {...otherProps}>
          {children}
        </Slot>
      );
    }
    
    // When asChild is false or not provided, render a div
    return <div ref={ref} {...otherProps}>{children}</div>;
  });
  
  SlotWrapper.displayName = 'SlotWrapper';
  
  return SlotWrapper;
};
