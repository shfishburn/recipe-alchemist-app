
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useScrollRestoration } from '@/hooks/use-scroll-restoration';
import { PageLoadingFallback } from '@/components/ui/PageLoadingFallback';
import '@/styles/touch-optimizations.css';
import { useAuth } from '@/hooks/use-auth';
import { PageContainer } from '@/components/ui/containers';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
    <div className={`index-page w-full ${isTouch ? 'touch-optimized mobile-friendly-container' : ''}`}>
      <div className="w-full max-w-full overflow-hidden">
        {loading ? (
          <PageLoadingFallback />
        ) : (
          <Suspense fallback={<PageLoadingFallback />}>
            {session ? <UserDashboard /> : <MarketingHomepage />}
          </Suspense>
        )}
      </div>
      
      {/* Material Design Showcase Banner */}
      <div className="container-page mt-8 mb-12">
        <div className="bg-secondary/10 rounded-lg p-6 shadow-elevation-1 material-scale-in">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="material-headline-small mb-2">Explore Our Material Design</h3>
              <p className="material-body-medium text-muted-foreground">
                Check out our new Material Design components and styling in the showcase.
              </p>
            </div>
            <Link to="/material-showcase">
              <Button variant="filled" className="shadow-elevation-1 material-elevation-transition">
                View Showcase
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
