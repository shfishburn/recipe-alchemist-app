
import { QueryClient } from "@tanstack/react-query";

// Configure QueryClient with enhanced performance settings
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 300000, // 5 minutes (increased from 30 seconds)
      gcTime: 600000,   // 10 minutes (increased from 5 minutes)
    },
  },
});
