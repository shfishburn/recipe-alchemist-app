
import * as React from "react";

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

/**
 * Slot component that merges its props with its child element
 */
const Slot = React.forwardRef<HTMLElement, SlotProps>((props, ref) => {
  const { children, ...rest } = props;
  
  // Only proceed if we have a valid React element
  if (!React.isValidElement(children)) {
    return null;
  }
  
  // Clone the element and properly merge refs
  return React.cloneElement(children, {
    ...rest,
    ref: mergeRefs([ref, (children as any)._owner?.ref]),
  });
});

/**
 * Merges multiple React refs into a single ref function
 */
function mergeRefs(refs: Array<React.Ref<any> | undefined | null>) {
  return (value: any) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<any>).current = value;
      }
    });
  };
}

Slot.displayName = "Slot";

export { Slot };
