
import * as React from "react"

type SlotProps = React.HTMLAttributes<HTMLElement> & {
  asChild?: boolean;
  children: React.ReactNode;
};

/**
 * This is a simplified version of Radix UI's Slot component
 */
const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, asChild = false, ...props }, forwardedRef) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children,
        {
          ...mergeProps(props, children.props),
          ref: mergeRefs([forwardedRef, (children as any).ref]),
        }
      );
    }
    
    return (
      <span {...props} ref={forwardedRef as React.ForwardedRef<HTMLSpanElement>}>
        {children}
      </span>
    );
  }
);
Slot.displayName = "Slot";

// Utility function to merge refs with proper typing
function mergeRefs<T = any>(refs: Array<React.Ref<T> | undefined | null>): React.RefCallback<T> {
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

// Utility function to merge props with proper typing
function mergeProps(
  slotProps: React.HTMLAttributes<HTMLElement>,
  childProps: Record<string, any>
): Record<string, any> {
  const merged = { ...childProps };
  
  Object.entries(slotProps).forEach(([propName, slotValue]) => {
    if (propName.startsWith('on') && typeof slotValue === 'function' && typeof childProps[propName] === 'function') {
      // For event handlers, create a new function that calls both handlers
      const childHandler = childProps[propName];
      
      merged[propName] = function mergedHandler(...args: any[]) {
        childHandler(...args);
        (slotValue as Function)(...args);
      };
    } else if (propName === 'className' && slotValue && childProps[propName]) {
      // Join classNames
      merged[propName] = `${childProps[propName]} ${slotValue}`;
    } else if (propName === 'style' && slotValue && childProps[propName]) {
      // Merge styles
      merged[propName] = { ...childProps[propName], ...slotValue };
    } else if (!(propName in merged)) {
      // Use slot prop if child doesn't have it
      merged[propName] = slotValue;
    }
  });
  
  return merged;
}

export { Slot };
