
import React from 'react';

export const useSlot = () => {
  const SlotWrapper = React.forwardRef<
    HTMLDivElement,
    { asChild?: boolean; children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
  >((props, ref) => {
    const { asChild, children, ...otherProps } = props;
    
    // Only clone if children is a valid React element and asChild is true
    if (asChild && React.isValidElement(children)) {
      // When asChild is true, we clone the child element
      // and forward all props to it
      return React.cloneElement(children, {
        ...otherProps,
        // Forward the ref
        ref: (node: any) => {
          // Handle ref forwarding
          if (ref) {
            if (typeof ref === 'function') {
              ref(node);
            } else {
              (ref as React.MutableRefObject<any>).current = node;
            }
          }
          
          // Also forward to child's existing ref if it exists
          const childRef = (children as any).ref;
          if (childRef) {
            if (typeof childRef === 'function') {
              childRef(node);
            } else if (childRef.current !== undefined) {
              childRef.current = node;
            }
          }
        }
      } as React.HTMLAttributes<HTMLDivElement> & { ref?: any });
    }
    
    // When asChild is false or not provided, render a div
    return <div ref={ref} {...otherProps}>{children}</div>;
  });
  
  SlotWrapper.displayName = 'SlotWrapper';
  
  return SlotWrapper;
};
