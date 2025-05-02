
import React from 'react';

export const useSlot = () => {
  const SlotWrapper = React.forwardRef<
    HTMLDivElement,
    { asChild?: boolean; children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
  >((props, ref) => {
    const { asChild, children, ...otherProps } = props;
    
    if (asChild && React.isValidElement(children)) {
      // Use type assertion to make TypeScript happy with ref handling
      const childProps = {
        ...otherProps,
        // Properly handle the ref merging
        ref: (innerRef: any) => {
          // Handle refs properly using type-safe approach
          if (typeof ref === "function") {
            ref(innerRef);
          } else if (ref) {
            (ref as React.MutableRefObject<unknown>).current = innerRef;
          }
          
          // Forward the ref to the child if it has one
          const childRef = (children as any).ref;
          if (childRef) {
            if (typeof childRef === "function") {
              childRef(innerRef);
            } else {
              childRef.current = innerRef;
            }
          }
        }
      };
      
      return React.cloneElement(children, childProps);
    }
    
    // Return a div when not using asChild
    return React.createElement("div", { ...otherProps, ref }, children);
  });
  
  SlotWrapper.displayName = 'SlotWrapper';
  
  return SlotWrapper;
};
