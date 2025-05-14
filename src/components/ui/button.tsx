
import * as React from "react"
import { Slot } from "@/components/ui/slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden touch-feedback",
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
        // Material Design variants
        elevated: "bg-background text-foreground shadow-elevation-1 hover:shadow-elevation-2 active:shadow-elevation-1 border",
        filled: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        tonal: "bg-secondary/80 text-secondary-foreground hover:bg-secondary/70 active:bg-secondary/60",
        text: "text-primary hover:bg-primary/10 active:bg-primary/20",
        // Add success variant
        success: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        mobile: "h-12 px-5 py-3 text-base", // Mobile-friendly size
        // Material sizes
        xs: "h-8 px-2 rounded-md text-xs",
        xl: "h-12 px-10 rounded-md text-lg",
      },
      // Material touch feedback properties
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
    onClick,
    ...props 
  }, ref) => {
    // Create ripple effect state
    const [ripples, setRipples] = React.useState<Array<{ x: number, y: number, id: number }>>([]);
    const nextRippleId = React.useRef(0);
    
    // Handle click for ripple effect
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const id = nextRippleId.current;
      nextRippleId.current += 1;
      
      setRipples([...ripples, { x, y, id }]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(currentRipples => currentRipples.filter(ripple => ripple.id !== id));
      }, 600);
      
      // Call original onClick handler
      if (onClick) onClick(event);
    };
    
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, touchFeedback, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        onClick={handleClick}
        {...props}
      >
        {/* Ripple elements */}
        {ripples.map(ripple => (
          <span 
            key={ripple.id}
            className="absolute bg-white/30 dark:bg-black/30 rounded-full animate-material-ripple pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 20,
              height: 20,
              transform: 'translate(-50%, -50%) scale(0)',
              transformOrigin: 'center',
            }}
          />
        ))}
        
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
