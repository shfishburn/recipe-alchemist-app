
import * as React from "react";

type AnyProps = Record<string, any>;

/**
 * Merges multiple refs into one
 */
function mergeRefs<T = any>(refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>): React.RefCallback<T> {
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
 * Merges multiple objects together
 */
function mergeProps<T extends AnyProps = AnyProps>(slotProps: T, childProps: T): T {
  // All non-event props from child
  const nonEventChildProps = Object.fromEntries(
    Object.entries(childProps).filter(([key]) => !key.startsWith("on"))
  );

  // All event handlers merged together
  const mergedEventHandlers = Object.fromEntries(
    Object.entries({...slotProps, ...childProps})
      .filter(([key]) => key.startsWith("on"))
      .map(([key, value]) => {
        const slotHandler = slotProps[key];
        const childHandler = childProps[key];
        
        return [
          key,
          // If both slot and child have the same handler, call both
          slotHandler && childHandler
            ? (...args: unknown[]) => {
                childHandler(...args);
                slotHandler(...args);
              }
            : slotHandler || childHandler
        ];
      })
  );

  return {
    ...slotProps,
    ...nonEventChildProps,
    ...mergedEventHandlers,
  } as T;
}

interface SlotProps {
  children?: React.ReactNode;
}

/**
 * This component is used to merge the props of a parent component with the props of a child component.
 * It's useful for creating compound components that share props.
 */
const Slot = React.forwardRef<HTMLElement, SlotProps>(
  (props, ref) => {
    const { children, ...slotProps } = props;
    
    if (!React.isValidElement(children)) {
      return null;
    }
    
    // Clone the child and merge the props and ref
    return React.cloneElement(
      children,
      {
        ...mergeProps(slotProps as AnyProps, children.props as AnyProps),
        ref: mergeRefs([ref, (children as any).ref]) // Correctly merge refs
      }
    );
  }
);

Slot.displayName = "Slot";

export { Slot };
