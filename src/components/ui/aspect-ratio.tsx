
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
import React from "react"

interface AspectRatioProps extends React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> {
  className?: string;
  children?: React.ReactNode;
}

const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  AspectRatioProps
>(({ className, children, ...props }, ref) => (
  <div className={className ? className : "relative w-full"}>
    <AspectRatioPrimitive.Root ref={ref} {...props}>
      {children}
    </AspectRatioPrimitive.Root>
  </div>
))

AspectRatio.displayName = "AspectRatio"

export { AspectRatio }
