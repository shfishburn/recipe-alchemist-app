
import React, { Suspense, lazy, useState, useEffect } from 'react';
import Navbar from '@/components/ui/navbar';
import { useScrollRestoration } from '@/hooks/use-scroll-restoration';
import { Skeleton } from '@/components/ui/skeleton';
import '@/styles/touch-optimizations.css';
import { useAuth } from '@/hooks/use-auth';
import { MarketingHomepage } from '@/components/landing/MarketingHomepage';
import { UserDashboard } from '@/components/landing/UserDashboard';

const Index = () => {
  console.log('Rendering Index page');
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
      <main className="flex-1 animate-fadeIn pb-8 md:pb-12 touch-scroll">
        {loading ? (
          <PageLoadingSkeleton />
        ) : session ? (
          <UserDashboard />
        ) : (
          <MarketingHomepage />
        )}
      </main>
    </div>
  );
};

// Loading skeleton component for when authentication status is being checked
const PageLoadingSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto px-4 py-8">
    <div className="space-y-8">
      <Skeleton className="h-12 w-48 md:w-64 mx-auto" />
      <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array(3).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

export default Index;
