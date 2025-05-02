
import * as React from "react";

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>((props, ref) => {
  const { children, ...rest } = props;
  
  if (!React.isValidElement(children)) {
    return null;
  }
  
  return React.cloneElement(children, { 
    ...rest, 
    ref: (childRef: any) => {
      // Handle refs properly
      if (typeof ref === "function") {
        ref(childRef);
      } else if (ref) {
        (ref as React.MutableRefObject<unknown>).current = childRef;
      }
      
      // Forward the ref to the child if it has one
      const childExistingRef = (children as any).ref;
      if (childExistingRef) {
        if (typeof childExistingRef === "function") {
          childExistingRef(childRef);
        } else {
          childExistingRef.current = childRef;
        }
      }
    }
  });
});

Slot.displayName = "Slot";

export { Slot };
