
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useScrollRestoration } from '@/hooks/use-scroll-restoration';
import { PageLoadingFallback } from '@/components/ui/PageLoadingFallback';
import '@/styles/touch-optimizations.css';
import { useAuth } from '@/hooks/use-auth';
import { PageContainer } from '@/components/ui/containers';

// Lazy-loaded landing components
const UserDashboard = lazy(() => import('@/components/landing/UserDashboard').then(m => ({ default: m.UserDashboard })));
const MarketingHomepage = lazy(() => import('@/components/landing/MarketingHomepage').then(m => ({ default: m.MarketingHomepage })));

const Index: React.FC = () => {
  useScrollRestoration();

  const [isTouch, setIsTouch] = useState(false);
  const { session, loading } = useAuth();

  useEffect(() => {
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0;
    setIsTouch(touch);

    if (touch) {
      document.body.classList.add('touch-device');
      document.body.classList.add('touch-optimized');
    }
    document.body.classList.remove('overflow-hidden');

    // Remove mobile wrappers when component unmounts
    return () => {
      document.body.classList.remove('touch-device');
      document.body.classList.remove('touch-optimized');
    };
  }, []);

  return (
    <PageContainer 
      className={`index-page ${isTouch ? 'touch-optimized mobile-friendly-container' : ''}`}
      variant="default"
      withNavbar={true}
    >
      <div className="w-full max-w-full overflow-hidden">
        {loading ? (
          <PageLoadingFallback />
        ) : (
          <Suspense fallback={<PageLoadingFallback />}>
            {session ? <UserDashboard /> : <MarketingHomepage />}
          </Suspense>
        )}
      </div>
    </PageContainer>
  );
};

export default Index;
