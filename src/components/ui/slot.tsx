
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
  
  // Use React.useEffect to handle ref forwarding properly
  React.useEffect(() => {
    if (!ref) return;
    
    const childElement = children as React.ReactElement & { ref?: React.Ref<any> };
    const childRef = childElement.ref;
    
    // Get the underlying DOM node
    let node: any = null;
    
    // Wait until the component is mounted and we can access its DOM node
    const getNode = () => {
      if (typeof ref === 'function') {
        // For function refs, we need a way to get the DOM node
        // This is difficult without modifying the original element
        return;
      } else if (ref && 'current' in ref) {
        // For object refs, we can directly access the DOM node
        node = ref.current;
      }
      
      // Now handle forwarding this ref to the child's ref if it exists
      if (childRef) {
        if (typeof childRef === 'function') {
          childRef(node);
        }
        // We can't modify childRef.current as it's readonly
      }
    };
    
    // Call once to set initial ref
    getNode();
    
    // Cleanup
    return () => {
      if (childRef && typeof childRef === 'function') {
        childRef(null);
      }
    };
  }, [children, ref]);
  
  return clonedElement;
});

Slot.displayName = "Slot";

export { Slot };
