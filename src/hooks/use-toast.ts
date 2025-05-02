
// This is a modified version of the toast hook that is touch-optimized
import { useState, useEffect } from 'react'
import { toast as sonnerToast, type ToastT, type ExternalToast } from 'sonner'

export type ToastProps = ExternalToast & {
  id?: string | number
}

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
  }
}
