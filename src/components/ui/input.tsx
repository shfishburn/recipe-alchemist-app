
import * as React from "react"
import { cn } from "@/lib/utils"
import { X, Eye, EyeOff } from "lucide-react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helperText?: string;
  showCount?: boolean;
  onClear?: () => void;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = "text", 
    error, 
    helperText,
    showCount,
    onClear,
    leftAddon,
    rightAddon,
    ...props 
  }, ref) => {
    const [inputType, setInputType] = React.useState(type);
    const [valueLength, setValueLength] = React.useState(props.value?.toString().length || 0);
    const inputRef = React.useRef<HTMLInputElement>(null);
    
    // Forward ref handling
    const resolvedRef = ref || inputRef;
    
    // Handle password visibility toggle
    const togglePasswordVisibility = () => {
      setInputType(inputType === 'password' ? 'text' : 'password');
    };
    
    // Update character count
    React.useEffect(() => {
      if (showCount || props.maxLength) {
        setValueLength(props.value?.toString().length || 0);
      }
    }, [props.value, showCount, props.maxLength]);
    
    // Clear button handler
    const handleClear = () => {
      if (onClear) {
        onClear();
      } else if (inputRef.current) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set;
        
        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(inputRef.current, '');
          const event = new Event('input', { bubbles: true });
          inputRef.current.dispatchEvent(event);
        }
      }
    };
    
    return (
      <div className="w-full space-y-1.5">
        <div className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-recipe-blue focus-within:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50 transition-shadow duration-200 truncate",
          error && "border-red-500 focus-within:ring-red-500",
          className
        )}>
          {leftAddon && <span className="flex items-center mr-2">{leftAddon}</span>}
          
          <input
            type={inputType}
            className={cn(
              "flex-1 border-0 bg-transparent p-0 outline-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 w-full"
            )}
            ref={resolvedRef}
            {...props}
          />
          
          {type === 'password' && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="flex items-center ml-2 text-muted-foreground hover:text-foreground"
              aria-label={inputType === 'password' ? 'Show password' : 'Hide password'}
            >
              {inputType === 'password' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          )}
          
          {props.value && onClear && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center justify-center h-4 w-4 rounded-full text-muted-foreground hover:text-foreground ml-2"
              aria-label="Clear input"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          
          {rightAddon && <span className="flex items-center ml-2">{rightAddon}</span>}
        </div>
        
        <div className="flex items-center justify-between text-xs">
          {(error || helperText) && (
            <p className={cn(
              "text-xs",
              error ? "text-red-500" : "text-muted-foreground"
            )} role={error ? "alert" : undefined}>
              {error || helperText}
            </p>
          )}
          
          {(showCount || props.maxLength) && (
            <p className={cn(
              "text-xs ml-auto",
              props.maxLength && valueLength > (props.maxLength || 0) ? "text-red-500" : "text-muted-foreground"
            )}>
              {valueLength}{props.maxLength ? `/${props.maxLength}` : ''}
            </p>
          )}
        </div>
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
