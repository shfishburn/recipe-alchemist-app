
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, htmlFor, ...props }, ref) => {
  // Add a click handler to focus the associated input with improved keyboard handling
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (htmlFor) {
      const input = document.getElementById(htmlFor);
      if (input) {
        input.focus();
      }
    }
  };

  // Add keyboard handler to focus associated input on Enter or Space
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      if (htmlFor) {
        const input = document.getElementById(htmlFor);
        if (input) {
          input.focus();
        }
      }
    }
  };

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      htmlFor={htmlFor}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0} // Make the label focusable for keyboard users
      {...props}
    />
  );
})
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
