
import { QueryClient } from "@tanstack/react-query";

// Configure QueryClient with enhanced caching
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000, // 30 seconds
      gcTime: 300000,   // 5 minutes
    },
  },
});
