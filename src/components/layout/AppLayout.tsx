
import React, { useEffect } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageTransition } from "@/components/ui/page-transition";
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
import { prefetchAssets } from '@/utils/performance';

export const AppLayout = () => {
  // Apply scroll restoration hook
  useScrollRestoration();
  const location = useLocation();
  
  // Check if we're on the loading page
  const isLoadingRoute = location.pathname === '/loading';

  // Prefetch critical assets for better performance
  useEffect(() => {
    prefetchAssets([
      // Critical scripts and styles for the loading experience
      '/src/components/quick-recipe/QuickRecipeDisplay.tsx',
      '/src/components/quick-recipe/QuickRecipeFormContainer.tsx',
      '/src/styles/loading.css',
    ]);
  }, []);
  
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
  
  // If we're on the loading route, render only the LoadingPage with smooth transition
  if (isLoadingRoute) {
    const LoadingPage = React.lazy(() => import("@/pages/LoadingPage"));
    return (
      <React.Suspense fallback={
        <div className="fixed inset-0 bg-white dark:bg-gray-950 flex items-center justify-center">
          <div className="loading-pulse-ring w-20 h-20 border-4 border-recipe-green opacity-30"></div>
          <div className="loading-pulse-ring w-16 h-16 border-4 border-recipe-blue opacity-20" 
               style={{ animationDelay: '-0.5s' }}></div>
        </div>
      }>
        <LoadingPage />
      </React.Suspense>
    );
  }
  
  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        <DefaultSeo />
        <LoadingIndicator />
        <Navbar />
        <main className="flex-1">
          <PageTransition>
            <AppRoutes />
          </PageTransition>
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
