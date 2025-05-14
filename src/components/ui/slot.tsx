
import * as React from "react"

type SlotProps = {
  children?: React.ReactNode
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, forwardedRef) => {
    // This component renders the first child that's a function, providing it with props.
    if (!children) {
      return null
    }

    // Filter out non-functional children
    const childrenArray = React.Children.toArray(children)
    const slottableChildren = childrenArray.filter(
      (child) =>
        typeof child === "function" &&
        Boolean(child)
    )

    if (slottableChildren.length === 0) {
      // If there are no functional children, render the children as-is
      return <>{children}</>
    }

    const slottableChild = slottableChildren[0] as (props: any) => React.ReactElement

    // Improved type safety for merging props
    const mergeProps = <T,>(slotProps: T): T => {
      return {
        ...slotProps,
        ...props,
        ref: forwardedRef,
      } as T
    }

    return <>{slottableChild(mergeProps)}</>
  }
)

Slot.displayName = "Slot"

export { Slot }
