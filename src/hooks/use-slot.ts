
import React from 'react';

export const useSlot = () => {
  const SlotWrapper = React.forwardRef<
    HTMLDivElement,
    { asChild?: boolean; children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
  >((props, ref) => {
    const { asChild, children, ...otherProps } = props;
    
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...otherProps,
        ref: (innerRef: any) => {
          // Handle refs properly
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
      });
    }
    
    return <div ref={ref} {...otherProps}>{children}</div>;
  });
  
  SlotWrapper.displayName = 'SlotWrapper';
  
  return SlotWrapper;
};
