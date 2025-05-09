
import React, { useEffect } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageTransition } from "@/components/ui/page-transition";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { DefaultSeo } from "@/components/seo/DefaultSeo";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { Outlet } from "react-router-dom";
import { FooterWrapper } from "@/components/layout/FooterWrapper";
import { useScrollRestoration } from "@/hooks/use-scroll-restoration";
import { setupRouteChangeCleanup, cleanupUIState } from "@/utils/dom-cleanup";

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
        <PageTransition>
          <Outlet />
        </PageTransition>
        <FooterWrapper />
        {/* Move these components below the main content to prevent render blocking */}
        <Toaster />
        <Sonner />
        <CookieConsent />
      </div>
    </TooltipProvider>
  );
};
