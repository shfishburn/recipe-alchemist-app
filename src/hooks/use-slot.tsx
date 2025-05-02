
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
      // and forward all props to it with proper TypeScript typing
      return React.cloneElement(children, {
        ...otherProps,
        // Forward the ref with proper TypeScript typing
        ref: (node: unknown) => {
          // Handle ref forwarding
          if (typeof ref === 'function') {
            ref(node as HTMLDivElement);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement>).current = node as HTMLDivElement;
          }
          
          // Also forward to child's existing ref if it exists
          const childRef = (children as React.ReactElement<any>).ref;
          if (childRef) {
            if (typeof childRef === 'function') {
              childRef(node);
            } else {
              const refObject = childRef as React.MutableRefObject<unknown>;
              if (refObject && 'current' in refObject) {
                refObject.current = node;
              }
            }
          }
        }
      } as React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<unknown> });
    }
    
    // When asChild is false or not provided, render a div
    return <div ref={ref} {...otherProps}>{children}</div>;
  });
  
  SlotWrapper.displayName = 'SlotWrapper';
  
  return SlotWrapper;
};
