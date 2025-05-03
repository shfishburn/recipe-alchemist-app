
import React from 'react';

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
    
    // Only clone if children is a valid React element and asChild is true
    if (asChild && React.isValidElement(children)) {
      // Safer cloning with proper ref handling
      return React.cloneElement(children as React.ReactElement, {
        ...otherProps,
        ref: ref 
          ? composeRefs(ref, (children as any).ref) 
          : (children as any).ref,
      });
    }
    
    // When asChild is false or not provided, render a div
    return <div ref={ref} {...otherProps}>{children}</div>;
  });
  
  SlotWrapper.displayName = 'SlotWrapper';
  
  return SlotWrapper;
};
