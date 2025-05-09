
// This is a modified version of the toast hook that is touch-optimized
import { toast as sonnerToast, type ToastT, type ExternalToast as SonnerExternalToast } from 'sonner'

// Extend the Sonner toast interface to include our custom properties
export interface ExternalToast extends SonnerExternalToast {
  id?: string | number;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
}

export type ToastProps = ExternalToast

// Toast function with consolidated options and better defaults
export function toast(props: ToastProps) {
  // Enhanced touch feedback for toast interactions
  const enhancedProps = {
    ...props,
    // Increase default duration for better readability on mobile
    duration: props.duration || 5000,
    // Add classes for touch optimization and hardware acceleration
    className: `${props.className || ''} touch-optimized hw-boost`,
  }
  
  // For sonner v1.0.0+, the toast function accepts a title as first arg and options object as second arg
  if (props.title) {
    return sonnerToast(props.title, {
      ...enhancedProps,
      description: props.description
    })
  }
  
  // For backward compatibility and simpler calls
  return sonnerToast(enhancedProps as unknown as React.ReactNode)
}

// Enhanced hook with convenience methods
export function useToast() {
  return {
    toast,
    // Re-export other toast functions from sonner
    dismiss: sonnerToast.dismiss,
    error: (props: ToastProps) => toast({ ...props, variant: "destructive" }),
    success: (props: ToastProps) => toast({ ...props, variant: "success" }),
    info: (props: ToastProps) => toast({ ...props, variant: "default" }),
    // Include toasts property for the Toaster component
    toasts: [],
  }
}
