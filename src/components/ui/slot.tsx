
import * as React from "react";

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>((props, ref) => {
  const { children, ...rest } = props;
  
  if (!React.isValidElement(children)) {
    return null;
  }
  
  // Clone the element but handle the ref separately to avoid TypeScript errors
  const clonedElement = React.cloneElement(children, { 
    ...rest 
  });
  
  // Use React.useEffect to handle ref merging instead of directly in props
  React.useEffect(() => {
    const childElement = children as React.ReactElement & { ref?: React.Ref<any> };
    const childRef = childElement.ref;
    
    if (ref && childRef) {
      // Handle refs properly based on their type
      if (typeof childRef === 'function' && typeof ref === 'function') {
        // If both are function refs
        const originalChildRef = childRef;
        childRef((value: any) => {
          originalChildRef(value);
          ref(value);
        });
      } else {
        // For object refs
        const currentRef = typeof ref === 'function' ? null : ref.current;
        if (typeof childRef !== 'function') {
          childRef.current = currentRef;
        }
      }
    }
  }, [children, ref]);
  
  return clonedElement;
});

Slot.displayName = "Slot";

export { Slot };
