
import React from 'react';

export const useSlot = () => {
  const SlotWrapper = React.forwardRef<
    HTMLDivElement,
    { asChild?: boolean; children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
  >((props, ref) => {
    const { asChild, children, ...otherProps } = props;
    
    if (asChild && React.isValidElement(children)) {
      // Clone the child, but handle ref separately
      const clonedChild = React.cloneElement(children, otherProps);
      
      // Use effect to handle ref forwarding properly
      React.useEffect(() => {
        if (!ref) return;
        
        const childElement = children as React.ReactElement & { ref?: React.Ref<any> };
        const childRef = childElement.ref;
        
        // Get the underlying DOM node
        let node: any = null;
        
        // For object refs, we can access the DOM node
        if (ref && typeof ref !== 'function' && 'current' in ref) {
          node = ref.current;
          
          // Now handle forwarding this ref to the child's ref if it exists
          if (childRef && typeof childRef === 'function') {
            childRef(node);
          }
          // We can't modify childRef.current directly as it's readonly
        }
        
        // Cleanup
        return () => {
          if (childRef && typeof childRef === 'function') {
            childRef(null);
          }
        };
      }, [children, ref]);
      
      return clonedChild;
    }
    
    // Return a div when not using asChild
    return React.createElement("div", { ...otherProps, ref }, children);
  });
  
  SlotWrapper.displayName = 'SlotWrapper';
  
  return SlotWrapper;
};
