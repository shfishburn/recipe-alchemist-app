
import React from 'react';

/**
 * Merges multiple React refs into a single ref function
 */
function mergeRefs(refs: Array<React.Ref<any> | undefined | null>) {
  return (value: any) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<any>).current = value;
      }
    });
  };
}

export const useSlot = () => {
  const SlotWrapper = React.forwardRef<
    HTMLDivElement,
    { asChild?: boolean; children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
  >((props, ref) => {
    const { asChild, children, ...otherProps } = props;
    
    // Only clone if children is a valid React element and asChild is true
    if (asChild && React.isValidElement(children)) {
      // When asChild is true, we clone the child element and forward props
      return React.cloneElement(children, {
        ...otherProps,
        // Properly merge refs using our helper function
        ref: mergeRefs([ref, (children as any)._owner?.ref]),
      });
    }
    
    // When asChild is false or not provided, render a div
    return <div ref={ref} {...otherProps}>{children}</div>;
  });
  
  SlotWrapper.displayName = 'SlotWrapper';
  
  return SlotWrapper;
};
