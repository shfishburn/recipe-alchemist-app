
import * as React from "react";

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

/**
 * Custom Slot component that merges props with child element
 * Handles multiple children more gracefully than React.Children.only
 */
const Slot = React.forwardRef<HTMLElement, SlotProps>((props, ref) => {
  const { children, ...rest } = props;
  
  // If no children, return null
  if (!children) {
    return null;
  }
  
  // Use Children.toArray to handle multiple children safely
  const childrenArray = React.Children.toArray(children);
  
  // If array is empty after filtering, return null
  if (childrenArray.length === 0) {
    return null;
  }
  
  // Use first child if it's a valid element
  const firstChild = childrenArray[0];
  
  // Only proceed if we have a valid React element
  if (!React.isValidElement(firstChild)) {
    console.warn("Slot received non-element child");
    return null;
  }
  
  // Clone the element with merged props
  return React.cloneElement(firstChild, {
    ...rest,
    ref: composeRefs(ref, (firstChild as any).ref),
  });
});

/**
 * Helper to compose multiple refs into one
 */
const composeRefs = <T extends any>(
  ...refs: Array<React.Ref<T> | undefined | null>
): React.RefCallback<T> => {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
};

Slot.displayName = "Slot";

export { Slot };
