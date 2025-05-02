
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
  
  // Clone the element with proper TypeScript typing
  return React.cloneElement(
    children as React.ReactElement<any>,
    {
      ...rest,
      ref: composeRefs(ref, (children as any).ref),
    }
  );
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
