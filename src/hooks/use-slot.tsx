
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
        const childElement = children as React.ReactElement & { ref?: React.Ref<any> };
        const childRef = childElement.ref;
        
        if (ref) {
          if (childRef) {
            // Merge refs if both exist
            if (typeof ref === 'function' && typeof childRef === 'function') {
              const originalChildRef = childRef;
              childRef((value: any) => {
                originalChildRef(value);
                ref(value);
              });
            } else if (typeof ref !== 'function' && typeof childRef !== 'function') {
              // For object refs
              if (ref.current) {
                childRef.current = ref.current;
              }
            }
          }
        }
      }, [children, ref]);
      
      return clonedChild;
    }
    
    // Return a div when not using asChild
    return React.createElement("div", { ...otherProps, ref }, children);
  });
  
  SlotWrapper.displayName = 'SlotWrapper';
  
  return SlotWrapper;
};
