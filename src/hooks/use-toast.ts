
// This is a modified version of the toast hook that is touch-optimized
import { useState, useEffect } from 'react'
import { toast as sonnerToast, type ToastT, type ExternalToast as SonnerExternalToast } from 'sonner'

// Extend the Sonner toast interface to include our custom properties
export interface ExternalToast extends SonnerExternalToast {
  id?: string | number;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}

export type ToastProps = ExternalToast

export function toast(props: ToastProps) {
  // Enhanced touch feedback for toast interactions
  const enhancedProps = {
    ...props,
    // Increase default duration for better readability on mobile
    duration: props.duration || 5000,
    // Add classes for touch optimization
    className: `${props.className || ''} touch-optimized hw-boost`,
  }
  
  return sonnerToast(enhancedProps)
}

export function useToast() {
  return {
    toast,
    // Re-export other toast functions from sonner
    dismiss: sonnerToast.dismiss,
    error: (props: ToastProps) => toast({ ...props, variant: "destructive" }),
    success: (props: ToastProps) => toast(props),
    // Include toasts property for the Toaster component
    toasts: [],
  }
}
