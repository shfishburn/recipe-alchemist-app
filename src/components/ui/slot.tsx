
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
  // Use proper TypeScript casting to ensure type safety
  return React.cloneElement(children, {
    ...rest,
    // Use the appropriate approach for ref merging that TypeScript understands
    ref: (node: unknown) => {
      // Handle our forwarded ref
      if (typeof ref === 'function') {
        ref(node as HTMLElement);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLElement>).current = node as HTMLElement;
      }
      
      // Forward to child's existing ref if it exists
      const childRef = (children as React.ReactElement<any>).ref;
      if (childRef) {
        if (typeof childRef === 'function') {
          childRef(node);
        } else {
          // Make sure childRef exists and has current property
          const refObject = childRef as React.MutableRefObject<unknown>;
          if (refObject && 'current' in refObject) {
            refObject.current = node;
          }
        }
      }
    }
  } as React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<unknown> });
});

Slot.displayName = "Slot";

export { Slot };
