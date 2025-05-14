
// This is a standardized version of the toast hook that works across the application
import { toast as sonnerToast, type ToastT, type ExternalToast as SonnerExternalToast } from 'sonner'

// Extend the Sonner toast interface to include our custom properties
export interface ExternalToast extends SonnerExternalToast {
  id?: string | number;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
  action?: React.ReactNode;
  className?: string;
}

export type ToastProps = ExternalToast

// Toast function with consolidated options and better defaults
export function toast(props: ToastProps | string) {
  // Handle string case for simple messages
  if (typeof props === 'string') {
    return sonnerToast(props);
  }
  
  // Enhanced touch feedback for toast interactions
  const enhancedProps = {
    ...props,
    // Increase default duration for better readability on mobile
    duration: props.duration || 5000,
    // Add classes for touch optimization and hardware acceleration
    className: `${props.className || ''} touch-optimized hw-boost rounded-lg`,
  }
  
  // For title+description format
  if (props.title && props.description) {
    return sonnerToast(props.title as string, {
      ...enhancedProps,
      description: props.description
    })
  }
  
  // For simple title-only format
  if (props.title) {
    return sonnerToast(props.title as string, enhancedProps);
  }
  
  // Fallback for any other case
  return sonnerToast("Notification", enhancedProps);
}

// Add dismiss method to the toast function for easier access
toast.dismiss = sonnerToast.dismiss;

// Enhanced hook with convenience methods
export function useToast() {
  return {
    toast,
    // Re-export other toast functions from sonner
    dismiss: sonnerToast.dismiss,
    error: (props: string | ToastProps) => {
      if (typeof props === 'string') {
        return toast({ title: props, variant: "destructive" })
      }
      return toast({ ...props, variant: "destructive" })
    },
    success: (props: string | ToastProps) => {
      if (typeof props === 'string') {
        return toast({ title: props, variant: "success" })
      }
      return toast({ ...props, variant: "success" })
    },
    info: (props: string | ToastProps) => {
      if (typeof props === 'string') {
        return toast({ title: props, variant: "default" })
      }
      return toast({ ...props, variant: "default" })
    },
    // Include toasts property for legacy compatibility
    toasts: [],
  }
}
