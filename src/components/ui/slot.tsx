
import * as React from "react";

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>((props, ref) => {
  const { children, ...rest } = props;
  
  // Only proceed if we have a valid React element
  if (!React.isValidElement(children)) {
    return null;
  }
  
  // Clone the element and pass down props
  return React.cloneElement(children, {
    ...rest,
    ref: (value: unknown) => {
      // Handle ref forwarding
      if (typeof ref === 'function') {
        ref(value as HTMLElement);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLElement>).current = value as HTMLElement;
      }
      
      // Forward to child ref if it exists
      const childRef = (children as any).ref;
      if (childRef) {
        if (typeof childRef === 'function') {
          childRef(value);
        } else if (childRef) {
          childRef.current = value;
        }
      }
    }
  });
});

Slot.displayName = "Slot";

export { Slot };
