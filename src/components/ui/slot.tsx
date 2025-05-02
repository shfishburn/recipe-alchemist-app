
import * as React from "react";

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>((props, ref) => {
  const { children, ...rest } = props;
  
  if (!children || !React.isValidElement(children)) {
    return null;
  }
  
  return React.cloneElement(children, { 
    ...rest, 
    ref: (childRef: React.Ref<unknown>) => {
      // Handle refs properly
      if (typeof ref === "function") {
        ref(childRef);
      } else if (ref) {
        (ref as React.MutableRefObject<unknown>).current = childRef;
      }
      
      // Forward the ref to the child if it has one
      const { ref: childExistingRef } = children as unknown as { ref?: React.Ref<unknown> };
      if (childExistingRef) {
        if (typeof childExistingRef === "function") {
          childExistingRef(childRef);
        } else {
          (childExistingRef as React.MutableRefObject<unknown>).current = childRef;
        }
      }
    }
  });
});

Slot.displayName = "Slot";

export { Slot };
