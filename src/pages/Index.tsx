
import React, { Suspense, lazy, useState, useEffect } from 'react';
import Navbar from '@/components/ui/navbar';
import { useScrollRestoration } from '@/hooks/use-scroll-restoration';
import { PageLoadingFallback } from '@/components/ui/PageLoadingFallback';
import '@/styles/touch-optimizations.css';
import { useAuth } from '@/hooks/use-auth';

// Lazy load these components
const UserDashboard = lazy(() => import('@/components/landing/UserDashboard').then(module => ({
  default: module.UserDashboard
})));
const MarketingHomepage = lazy(() => import('@/components/landing/MarketingHomepage'));

const Index = () => {
  // Use our scroll restoration hook
  useScrollRestoration();
  
  // Add touch detection
  const [isTouch, setIsTouch] = useState(false);
  const { session, loading } = useAuth();
  
  // Detect touch capability
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      (navigator as any).msMaxTouchPoints > 0;
      
    setIsTouch(isTouchDevice);
    
    // Add touch class to body for global CSS targeting
    if (isTouchDevice) {
      document.body.classList.add('touch-device');
    }
    
    // Fix for touch responsiveness after login
    document.body.classList.remove('overflow-hidden');
    
    return () => {
      // Clean up when component unmounts
      document.body.classList.remove('touch-device');
      document.body.classList.remove('overflow-hidden');
    };
  }, []);
  
  return (
    <div className={`min-h-screen flex flex-col ${isTouch ? 'touch-optimized' : ''}`}>
      <Navbar />
      <main className="flex-1 pb-8 md:pb-12 touch-scroll">
        {loading ? (
          <PageLoadingFallback />
        ) : (
          <Suspense fallback={<PageLoadingFallback />}>
            {session ? <UserDashboard /> : <MarketingHomepage />}
          </Suspense>
        )}
      </main>
    </div>
  );
};

export default Index;
