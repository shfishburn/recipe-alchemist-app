
import * as React from "react";

interface SlotProps {
  children?: React.ReactNode;
  [key: string]: any; // Allow for additional props
}

/**
 * Custom Slot component that merges props with child element
 * Better handling of children without relying on React.Children.only
 */
const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
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
  
  // Type the first child correctly to handle ref properly
  const child = firstChild as React.ReactElement<any>;
  
  // Clone the element with merged props - fixed TypeScript handling of refs
  return React.cloneElement(child, {
    ...rest,
    ref: forwardedRef 
      ? composeRefs(forwardedRef, child.ref) 
      : child.ref,
  });
});

/**
 * Helper to compose multiple refs into one - improved typing
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
