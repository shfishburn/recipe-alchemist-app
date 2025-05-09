
// path: src/pages/index.tsx
// file: index.tsx
// updated: 2025-05-09 14:10 PM

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

    if (touch) document.body.classList.add('touch-device');
    document.body.classList.remove('overflow-hidden');

    return () => {
      document.body.classList.remove('touch-device');
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return (
    <PageContainer className={isTouch ? 'touch-optimized' : ''} variant="default">
      <div className="space-y-10">
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
