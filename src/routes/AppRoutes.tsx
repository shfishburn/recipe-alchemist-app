
import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PageLoadingFallback } from '@/components/ui/PageLoadingFallback';
import { MaterialHomepage } from '@/components/landing/MaterialHomepage';

// Lazy load the LazyRoutes component
const LazyRoutes = lazy(() => import('./LazyRoutes').then(module => ({ 
  default: () => {
    // LazyRoutes is exporting individual components, not a default component
    // So we create a component that renders a Routes component with the routes
    const ImportedRoutes = module;
    return (
      <Routes>
        <Route path="/recipes" element={<ImportedRoutes.Recipes />} />
        <Route path="/recipes/:id" element={<ImportedRoutes.RecipeDetail />} />
        <Route path="/auth" element={<ImportedRoutes.Auth />} />
        <Route path="/how-it-works" element={<ImportedRoutes.HowItWorks />} />
        <Route path="/articles/:id" element={<ImportedRoutes.ArticleDetail />} />
        <Route path="/faq" element={<ImportedRoutes.FAQ />} />
        <Route path="/about" element={<ImportedRoutes.About />} />
        <Route path="/contact" element={<ImportedRoutes.Contact />} />
        <Route path="/privacy" element={<ImportedRoutes.Privacy />} />
        <Route path="/terms" element={<ImportedRoutes.Terms />} />
        <Route path="/cookies" element={<ImportedRoutes.Cookies />} />
        <Route path="/profile" element={<ImportedRoutes.Profile />} />
        <Route path="/shopping-lists" element={<ImportedRoutes.ShoppingLists />} />
        <Route path="/favorites" element={<ImportedRoutes.Favorites />} />
        <Route path="/loading" element={<ImportedRoutes.LoadingPage />} />
        <Route path="/preview" element={<ImportedRoutes.RecipePreviewPage />} />
        <Route path="/recipe-preview" element={<ImportedRoutes.RecipePreviewPage />} /> {/* Add this route as a fallback for backward compatibility */}
        <Route path="/recipe-preview/:id" element={<ImportedRoutes.RecipePreviewPage />} /> {/* Add this route for shared recipes with IDs */}
        <Route path="*" element={<ImportedRoutes.NotFound />} />
      </Routes>
    );
  }
})));

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
