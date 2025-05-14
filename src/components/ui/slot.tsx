
import * as React from "react"

/**
 * This is a simplified version of Radix UI's Slot component
 */
const Slot = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { asChild?: boolean }
>(({ children, asChild = false, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children,
      {
        ...mergeProps(props, children.props),
        ref: mergeRefs([ref, (children as any).ref]),
      }
    );
  }
  
  return (
    <span {...props} ref={ref as React.ForwardedRef<HTMLSpanElement>}>
      {children}
    </span>
  );
});
Slot.displayName = "Slot";

// Utility function to merge refs
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

// Utility function to merge props - fixed to properly handle event handlers and type safety
function mergeProps<T extends Record<string, any>>(slotProps: T, childProps: T): Record<string, any> {
  const merged = { ...childProps };
  
  for (const propName in slotProps) {
    if (propName.startsWith('on') && typeof slotProps[propName] === 'function' && typeof childProps[propName] === 'function') {
      // For event handlers, create a new function that calls both handlers
      const slotHandler = slotProps[propName];
      const childHandler = childProps[propName];
      
      merged[propName] = function mergedHandler(...args: any[]) {
        childHandler(...args);
        slotHandler(...args);
      };
    } else if (propName === 'className' && slotProps[propName] && childProps[propName]) {
      // Join classNames
      merged[propName] = `${childProps[propName]} ${slotProps[propName]}`;
    } else if (propName === 'style' && slotProps[propName] && childProps[propName]) {
      // Merge styles
      merged[propName] = { ...childProps[propName], ...slotProps[propName] };
    } else if (!(propName in merged)) {
      // Use slot prop if child doesn't have it
      merged[propName] = slotProps[propName];
    }
  }
  
  return merged;
}

export { Slot };
