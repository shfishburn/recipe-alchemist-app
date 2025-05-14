
import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PageLoadingFallback } from '@/components/ui/PageLoadingFallback';
import { MaterialHomepage } from '@/components/landing/MaterialHomepage';

// Lazy load routes to improve initial load performance
const LazyRoutes = lazy(() => import('./LazyRoutes').then(module => ({ default: module.default || module })));

export function AppRoutes() {
  return (
    <Routes>
      {/* Immediate routes */}
      <Route path="/" element={<MaterialHomepage />} />
      
      {/* Lazy loaded routes */}
      <Route
        path="/*"
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <LazyRoutes />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
