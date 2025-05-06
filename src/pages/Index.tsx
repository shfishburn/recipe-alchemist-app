
import React, { Suspense, lazy, useState, useEffect } from 'react';
import Navbar from '@/components/ui/navbar';
import { useScrollRestoration } from '@/hooks/use-scroll-restoration';
import { PageLoadingFallback } from '@/components/ui/PageLoadingFallback';
import { useBatteryStatus } from '@/hooks/use-battery-status';
import LoadingIndicator from '@/components/ui/loading-indicator';
import '@/styles/touch-optimizations.css';
import { useAuth } from '@/hooks/use-auth';

// Properly lazy load these components with consistent import pattern
const UserDashboard = lazy(() => import('@/components/landing/UserDashboard').then(module => ({
  default: module.UserDashboard
})));
const MarketingHomepage = lazy(() => import('@/components/landing/MarketingHomepage').then(module => ({
  default: module.MarketingHomepage
})));

const Index = () => {
  // Use our scroll restoration hook
  useScrollRestoration();
  
  // Add touch detection
  const [isTouch, setIsTouch] = useState(false);
  const { session, loading } = useAuth();
  const { lowPowerMode } = useBatteryStatus();
  
  // Detect touch capability
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      (navigator as any).msMaxTouchPoints > 0;
      
    setIsTouch(isTouchDevice);
    
    // Add touch class to body for global CSS targeting
    if (isTouchDevice) {
      document.body.classList.add('touch-device');
      
      // Add low power mode class if needed
      if (lowPowerMode) {
        document.body.classList.add('low-power-mode');
      }
    }
    
    // Fix for touch responsiveness after login
    document.body.classList.remove('overflow-hidden');
    
    return () => {
      // Clean up when component unmounts
      document.body.classList.remove('touch-device');
      document.body.classList.remove('overflow-hidden');
      document.body.classList.remove('low-power-mode');
    };
  }, [lowPowerMode]);
  
  return (
    <>
      <Navbar />
      <LoadingIndicator />
      <main className={`flex-1 pb-8 md:pb-12 touch-scroll ${isTouch ? 'touch-optimized' : ''} ${lowPowerMode ? 'reduce-animations' : ''}`}>
        {loading ? (
          <PageLoadingFallback />
        ) : (
          <Suspense fallback={<PageLoadingFallback />}>
            {session ? <UserDashboard /> : <MarketingHomepage />}
          </Suspense>
        )}
      </main>
    </>
  );
};

export default Index;
