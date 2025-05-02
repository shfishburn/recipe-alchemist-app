
import React from 'react';

export const useSlot = () => {
  const SlotWrapper = React.forwardRef<
    HTMLDivElement,
    { asChild?: boolean; children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
  >((props, ref) => {
    const { asChild, children, ...otherProps } = props;
    
    if (asChild && React.isValidElement(children)) {
      // When asChild is true, we want to clone the child element
      // and forward all props to it
      return React.cloneElement(children, {
        ...otherProps,
        // Properly merge refs using a callback ref
        ref: (node: any) => {
          // Handle forwarding ref to the child component
          if (ref) {
            if (typeof ref === 'function') {
              ref(node);
            } else {
              (ref as React.MutableRefObject<any>).current = node;
            }
          }
          
          // Forward to child's ref if it exists
          const childRef = (children as any).ref;
          if (childRef) {
            if (typeof childRef === 'function') {
              childRef(node);
            } else {
              childRef.current = node;
            }
          }
        }
      });
    }
    
    // When asChild is false or not provided, render a div
    return <div ref={ref} {...otherProps}>{children}</div>;
  });
  
  SlotWrapper.displayName = 'SlotWrapper';
  
  return SlotWrapper;
};
