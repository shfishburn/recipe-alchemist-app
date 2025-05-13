
import React, { Suspense, lazy, StrictMode } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./styles/loading.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-auth";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { CookieConsentProvider } from "@/hooks/use-cookie-consent";
import { queryClient } from "@/lib/query-client";
import { PageLoadingFallback } from "@/components/ui/PageLoadingFallback";

// Import AppLayout with lazy loading and error handling
const AppLayout = lazy(() => 
  import("@/components/layout/AppLayout")
    .then(module => ({ default: module.AppLayout }))
    .catch(err => {
      console.error("Error loading AppLayout:", err);
      return { default: () => <FallbackErrorComponent error="Failed to load application layout" /> };
    })
);

// Simple fallback error component
const FallbackErrorComponent = ({ error }: { error: string }) => (
  <div className="flex items-center justify-center min-h-screen flex-col p-4 text-center">
    <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
    <p className="mb-4">{error || "The application encountered an unexpected error."}</p>
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      onClick={() => window.location.reload()}
    >
      Reload App
    </button>
  </div>
);

// Enhanced error boundary with better error handling
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMessage: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("App error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackErrorComponent error={this.state.errorMessage} />;
    }
    return this.props.children;
  }
}

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <ErrorBoundary>
          <AuthProvider>
            <ProfileProvider>
              <CookieConsentProvider>
                <Suspense fallback={<PageLoadingFallback />}>
                  <AppLayout />
                </Suspense>
              </CookieConsentProvider>
            </ProfileProvider>
          </AuthProvider>
        </ErrorBoundary>
      </Router>
    </QueryClientProvider>
  </StrictMode>
);

export default App;
