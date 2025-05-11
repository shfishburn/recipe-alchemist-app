
import React, { useEffect } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { DefaultSeo } from "@/components/seo/DefaultSeo";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { AppRoutes } from "@/routes/AppRoutes";
import { FooterWrapper } from "@/components/layout/FooterWrapper";
import { useScrollRestoration } from "@/hooks/use-scroll-restoration";
import { Navbar } from "@/components/ui/navbar";
import { cleanupUIState, setupRouteChangeCleanup } from '@/utils/dom-cleanup';
import { useLocation } from "react-router-dom";
import PageWrapper from "@/components/ui/PageWrapper";

export const AppLayout = () => {
  // Apply scroll restoration hook
  useScrollRestoration();
  const location = useLocation();
  
  // Check if we're on the loading page
  const isLoadingRoute = location.pathname === '/loading';

  // If we're on the loading route, render only the LoadingPage
  if (isLoadingRoute) {
    const LoadingPage = React.lazy(() => import("@/pages/LoadingPage"));
    return (
      <React.Suspense fallback={<div className="fixed inset-0 bg-white dark:bg-gray-950" />}>
        <PageWrapper isLoading={true}>
          <LoadingPage />
        </PageWrapper>
      </React.Suspense>
    );
  }
  
  // Set up UI state cleanup for route changes
  useEffect(() => {
    // Clean up any existing issues when app loads
    cleanupUIState();
    
    // Set up cleanup for future route changes
    const cleanup = setupRouteChangeCleanup();
    
    return () => {
      cleanup();
      cleanupUIState();
    };
  }, []);
  
  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        <DefaultSeo />
        <LoadingIndicator />
        <Navbar />
        <main className="flex-1">
          <PageWrapper>
            <AppRoutes />
          </PageWrapper>
        </main>
        <FooterWrapper />
        <Toaster />
        <CookieConsent />
      </div>
    </TooltipProvider>
  );
};

// Default export for compatibility with lazy loading
export default AppLayout;
