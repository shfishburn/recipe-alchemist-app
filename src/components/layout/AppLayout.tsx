
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

// Simple utility to clean up UI state on route changes
const cleanupUIState = () => {
  // Remove any stuck loading classes
  document.body.classList.remove('overflow-hidden');
  
  // Remove any loading triggers
  const loadingTriggers = document.querySelectorAll('.loading-trigger');
  loadingTriggers.forEach(el => {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  });
};

// Set up route change cleanup
const setupRouteChangeCleanup = () => {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        cleanupUIState();
      }
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  return () => observer.disconnect();
};

export const AppLayout = () => {
  // Apply scroll restoration hook
  useScrollRestoration();
  
  // Set up UI state cleanup for route changes
  useEffect(() => {
    // Clean up any existing issues when app loads
    cleanupUIState();
    
    // Set up cleanup for future route changes
    const cleanupListener = setupRouteChangeCleanup();
    
    return () => {
      cleanupListener();
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
