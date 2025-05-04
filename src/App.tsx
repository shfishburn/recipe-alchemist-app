
import React, { Suspense } from "react";
import "./styles/loading.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-auth";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { CookieConsentProvider } from "@/hooks/use-cookie-consent";
import { queryClient } from "@/lib/query-client";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageLoadingFallback } from "@/components/ui/PageLoadingFallback";

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<PageLoadingFallback />}>
        <AuthProvider>
          <ProfileProvider>
            <CookieConsentProvider>
              <AppLayout />
            </CookieConsentProvider>
          </ProfileProvider>
        </AuthProvider>
      </Suspense>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
