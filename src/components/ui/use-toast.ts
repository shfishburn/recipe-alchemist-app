
import { useToast, toast } from "@/hooks/use-toast";

// Re-export the hooks and functions for compatibility
export { useToast, toast };

// For component compatibility with older code
export type {
  ExternalToast as ToastActionElement,
  ToastProps
} from "@/hooks/use-toast";
