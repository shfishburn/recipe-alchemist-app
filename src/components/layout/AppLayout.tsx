
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
import { useLocation, useNavigate } from "react-router-dom";
import '@/styles/loading.css';
import LoadingPage from '@/pages/LoadingPage';

// Updated utility function to prefetch assets that actually exist in production
const prefetchAssets = (urls: string[]) => {
  // Only run in production and only for actual CSS/JS files
  if (process.env.NODE_ENV !== 'development') {
    urls.forEach(url => {
      // Skip if the URL is a source file path that won't exist in production
      if (url.includes('/src/')) {
        console.log(`Skipping prefetch of source file: ${url}`);
        return;
      }
      
      try {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        link.as = url.endsWith('.css') ? 'style' : 'script';
        document.head.appendChild(link);
        console.log(`Prefetched: ${url}`);
      } catch (err) {
        console.warn(`Failed to prefetch: ${url}`, err);
      }
    });
  }
};

export const AppLayout = () => {
  // Apply scroll restoration hook
  useScrollRestoration();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're on the loading page
  const isLoadingRoute = location.pathname === '/loading';

  // Prefetch critical assets for better performance - using actual production asset paths
  useEffect(() => {
    // Only prefetch actual bundled assets, not source files
    prefetchAssets([
      // Main bundled assets rather than source files
      '/assets/index-KAloV5gI.js',
      '/assets/index-KAloV5gI.css',
    ]);
  }, []);
  
  // Set up UI state cleanup for route changes
  useEffect(() => {
    // Clean up any existing issues when app loads
    cleanupUIState();
    
    // Set up cleanup for future route changes - fix by passing the navigate function
    const cleanup = navigate ? setupRouteChangeCleanup(navigate) : () => {};
    
    return () => {
      cleanup();
      cleanupUIState();
    };
  }, [navigate]);
  
  // If we're on the loading route, render only the LoadingPage with smooth transition
  if (isLoadingRoute) {
    return <LoadingPage />;
  }
  
  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col overflow-x-hidden">
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
