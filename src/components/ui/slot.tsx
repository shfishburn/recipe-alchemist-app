
import * as React from "react";

// Define clearer types for the Slot component
interface SlotProps {
  children?: React.ReactNode;
  [key: string]: any; // Allow for additional props
}

/**
 * Custom Slot component that merges props with child element
 * With improved TypeScript handling for refs
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
  
  // Clone the element with merged props
  return React.cloneElement(
    firstChild as React.ReactElement<any>, 
    {
      ...rest,
      // When forwarding refs, we need to compose them properly
      ref: forwardedRef 
        ? composeRefs(forwardedRef, (firstChild as any).ref) 
        : (firstChild as any).ref,
    }
  );
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
