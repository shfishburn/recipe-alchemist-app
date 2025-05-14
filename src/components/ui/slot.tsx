import * as React from "react"

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

// A simple implementation of the Slot pattern
export const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    // If there's no children or a single child that's not a valid element, just return null
    if (!children || (React.Children.count(children) === 1 && !React.isValidElement(children))) {
      return null
    }

    // If there's only one child and it's a valid element, clone it and merge the props
    if (React.Children.count(children) === 1 && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...props,
        ...children.props,
        // Merge refs if the child has a ref
        ref: (children as any).ref
          ? mergeRefs([ref, (children as any).ref])
          : ref,
      })
    }

    // Otherwise, render a fragment
    return <>{children}</>
  }
)

Slot.displayName = "Slot"

// Helper to merge refs
const mergeRefs = (refs: React.Ref<any>[]) => {
  return (value: any) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value)
      } else if (ref != null) {
        ;(ref as React.MutableRefObject<any>).current = value
      }
    })
  }
}
