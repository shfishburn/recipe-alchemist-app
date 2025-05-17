import * as React from "react";

// Define clearer types for the Slot component
interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

/**
 * Custom Slot implementation to replace Radix Slot
 * Used for component composition
 */
export const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, forwardedRef) => {
    if (!children) {
      return null;
    }

    // If children is a valid element, clone it and pass the ref and props
    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...mergeProps(props, children.props),
        ref: forwardedRef
          ? mergeRefs([forwardedRef, (children as any).ref])
          : (children as any).ref,
      });
    }

    // Otherwise, render with props
    return (
      <span {...props} ref={forwardedRef as React.Ref<HTMLSpanElement>}>
        {children}
      </span>
    );
  }
);

/**
 * Helper to merge refs
 */
function mergeRefs<T = any>(refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

/**
 * Helper to merge props objects
 */
function mergeProps<T extends Record<string, any>>(
  slotProps: Record<string, any>,
  childProps: Record<string, any>
): T {
  // Create a new object with the properties of slotProps
  const merged = { ...slotProps };

  // For each property of childProps
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    // Skip the children prop
    if (propName === "children") {
      continue;
    }

    // Handle class/className merging
    if (
      propName === "className" ||
      propName === "class"
    ) {
      merged[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
      continue;
    }

    // Handle style merging
    if (propName === "style") {
      merged[propName] = { ...slotPropValue, ...childPropValue };
      continue;
    }

    // Handle event handlers
    if (
      propName.startsWith("on") &&
      typeof slotPropValue === "function" &&
      typeof childPropValue === "function"
    ) {
      merged[propName] = (...args: unknown[]) => {
        childPropValue(...args);
        slotPropValue(...args);
      };
      continue;
    }

    // For other props, child props override slot props
    merged[propName] = childPropValue !== undefined ? childPropValue : slotPropValue;
  }

  return merged as T;
}

Slot.displayName = "Slot";

export { Slot };
