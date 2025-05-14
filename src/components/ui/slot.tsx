
import * as React from "react"

type SlotProps = {
  children?: React.ReactNode
  [key: string]: any
}

// Inspired by Radix UI's Slot component
// https://www.radix-ui.com/primitives/docs/utilities/slot
export const Slot = React.forwardRef<HTMLElement, SlotProps>(
  (props, forwardedRef) => {
    const { children, ...slotProps } = props
    
    // If no children, don't render anything
    if (!children) {
      return null
    }

    // If the children is not a valid React element, wrap it in a span
    if (!React.isValidElement(children)) {
      return (
        <span {...slotProps} ref={forwardedRef as React.Ref<HTMLSpanElement>}>
          {children}
        </span>
      )
    }

    // Merge the props
    return React.cloneElement(children, {
      ...mergeProps(slotProps, children.props),
      ref: mergeRefs([forwardedRef, (children as any).ref]),
    })
  }
)

// Merge refs utility
function mergeRefs(refs: React.Ref<any>[]) {
  return (value: any) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value)
      } else if (ref != null) {
        (ref as React.MutableRefObject<any>).current = value
      }
    })
  }
}

// Utility function to merge props with proper typing
function mergeProps(
  slotProps: Record<string, any>,
  childProps: Record<string, any>
): Record<string, any> {
  const merged = { ...childProps }
  
  Object.entries(slotProps).forEach(([propName, slotValue]) => {
    // Handle class name merging
    if (propName === "className") {
      merged.className = [slotValue, childProps.className]
        .filter(Boolean)
        .join(" ")
    }
    // Handle event handlers
    else if (propName.startsWith("on") && typeof slotValue === "function" && typeof childProps[propName] === "function") {
      merged[propName] = (...args: any[]) => {
        childProps[propName](...args)
        slotValue(...args)
      }
    }
    // Handle all other props
    else if (!(propName in merged)) {
      merged[propName] = slotValue
    }
  })
  
  return merged
}

Slot.displayName = "Slot"
