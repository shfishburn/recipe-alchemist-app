
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
import { cleanupUIState, detectTouchDevice } from "@/utils/dom-cleanup";

export const AppLayout = () => {
  // Apply scroll restoration hook
  useScrollRestoration();
  
  // Clean up UI state on mount and route changes
  useEffect(() => {
    // Clean up any existing issues when app loads
    cleanupUIState();
    
    // Detect touch devices and add appropriate class
    detectTouchDevice();
    
    // Set up a MutationObserver to detect route changes
    const observer = new MutationObserver(() => {
      // Clean up any stuck UI states when DOM changes
      cleanupUIState();
    });
    
    // Start observing
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Clean up on unmount
    return () => {
      observer.disconnect();
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
