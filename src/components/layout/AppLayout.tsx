
import React from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageTransition } from "@/components/ui/page-transition";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { DefaultSeo } from "@/components/seo/DefaultSeo";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { AppRoutes } from "@/routes/AppRoutes";
import { FooterWrapper } from "@/components/layout/FooterWrapper";
import { useScrollRestoration } from "@/hooks/use-scroll-restoration";

export const AppLayout = () => {
  // Apply scroll restoration hook
  useScrollRestoration();
  
  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        <DefaultSeo />
        <Toaster />
        <Sonner />
        <LoadingIndicator />
        <CookieConsent />
        <PageTransition>
          <AppRoutes />
        </PageTransition>
        <FooterWrapper />
      </div>
    </TooltipProvider>
  );
};
