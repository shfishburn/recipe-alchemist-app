
import React, { Suspense, lazy, StrictMode } from "react";
import "./styles/loading.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-auth";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { CookieConsentProvider } from "@/hooks/use-cookie-consent";
import { queryClient } from "@/lib/query-client";
import { PageLoadingFallback } from "@/components/ui/PageLoadingFallback";

// Import AppLayout with lazy loading
const AppLayout = lazy(() => import("@/components/layout/AppLayout").then(module => ({
  default: module.AppLayout
})));

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<PageLoadingFallback />}>
        <ErrorBoundary>
          <AuthProvider>
            <ProfileProvider>
              <CookieConsentProvider>
                <AppLayout />
              </CookieConsentProvider>
            </ProfileProvider>
          </AuthProvider>
        </ErrorBoundary>
      </Suspense>
    </QueryClientProvider>
  </StrictMode>
);

// Simple error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("App error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen flex-col p-4 text-center">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="mb-4">The application encountered an unexpected error.</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default App;
