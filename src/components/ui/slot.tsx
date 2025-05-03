
import * as React from "react";

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

/**
 * Slot component that merges its props with its child element
 */
const Slot = React.forwardRef<HTMLElement, SlotProps>((props, ref) => {
  const { children, ...rest } = props;
  
  // If no children, return null
  if (!children) {
    return null;
  }
  
  // Only proceed if we have a valid React element
  if (!React.isValidElement(children)) {
    return null;
  }

  // Get a single child element, even if an array is passed
  let child: React.ReactElement | null = null;
  
  if (React.Children.count(children) > 1) {
    console.warn("Slot received multiple children, using only the first one");
    React.Children.forEach(children, (element, index) => {
      if (index === 0 && React.isValidElement(element)) {
        child = element;
      }
    });
  } else {
    child = React.isValidElement(children) ? children : null;
  }
  
  // If no valid child after processing, return null
  if (!child) {
    return null;
  }
  
  // Clone the element with proper TypeScript typing
  return React.cloneElement(child, {
    ...rest,
    ref: composeRefs(ref, (child as any).ref),
  });
});

/**
 * Composes multiple refs into one
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
