
// Re-export the standardized toast hook from the hooks directory
import { useToast, toast, type ExternalToast, type ToastProps } from "@/hooks/use-toast";

// Re-export everything for backward compatibility
export { useToast, toast, type ExternalToast as ToastActionElement, type ToastProps };
