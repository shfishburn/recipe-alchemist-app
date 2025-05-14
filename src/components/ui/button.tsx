
import * as React from "react"
import { Slot } from "@/components/ui/slot"  // Changed from "@radix-ui/react-slot" to our custom implementation
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-feedback",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/90",
        link: "text-primary underline-offset-4 hover:underline",
        // New variants
        success: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800",
        warning: "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700",
        info: "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        mobile: "h-12 px-5 py-3 text-base", // Mobile-friendly size
        // New sizes
        xs: "h-8 px-2 rounded-md text-xs",
        xl: "h-12 px-10 rounded-md text-lg",
      },
      // New touch feedback properties
      touchFeedback: {
        default: "active:scale-95 transition-transform duration-150",
        none: "",
        subtle: "active:scale-98 transition-transform duration-100",
        strong: "active:scale-90 transition-transform duration-200",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      touchFeedback: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    touchFeedback,
    asChild = false, 
    isLoading, 
    loadingText,
    leftIcon,
    rightIcon,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, touchFeedback, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-1">{leftIcon}</span>}
        {isLoading && loadingText ? loadingText : children}
        {!isLoading && rightIcon && <span className="ml-1">{rightIcon}</span>}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
