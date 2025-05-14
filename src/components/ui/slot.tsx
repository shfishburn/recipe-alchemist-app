
import * as React from "react"

type AnyProps = Record<string, any>;

/**
 * This is a simplified version of Radix UI's Slot component
 */
const Slot = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { asChild?: boolean }
>(({ children, asChild = false, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    // When cloning an element, we need to properly handle the ref
    return React.cloneElement(
      children,
      {
        ...mergeProps(props as AnyProps, children.props as AnyProps),
        // Fix: Ensure we properly merge refs without TypeScript errors
        ref: mergeRefs([ref, (children as any).ref])
      } as any // Use type assertion to avoid TypeScript errors
    );
  }
  
  return (
    <span {...props} ref={ref as React.ForwardedRef<HTMLSpanElement>}>
      {children}
    </span>
  );
});
Slot.displayName = "Slot";

// Utility function to merge refs with improved typing
function mergeRefs<T = any>(refs: Array<React.Ref<T> | null | undefined>): React.RefCallback<T> {
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

// Improved mergeProps with better type safety
function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged = { ...childProps };
  
  for (const propName in slotProps) {
    if (propName.startsWith('on') && typeof slotProps[propName] === 'function' && typeof childProps[propName] === 'function') {
      // For event handlers, create a new function that calls both handlers
      const slotHandler = slotProps[propName];
      const childHandler = childProps[propName];
      
      merged[propName] = function mergedHandler(...args: any[]) {
        // Use void to ignore return values
        void childHandler(...args);
        void slotHandler(...args);
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
