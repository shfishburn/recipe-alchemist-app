
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '@/components/PrivateRoute';
import * as LazyRoutes from '@/routes/LazyRoutes';
import { useAuth } from '@/hooks/use-auth';
import { PageLoadingFallback } from '@/components/ui/PageLoadingFallback';

// Custom suspense component that includes a timeout message
function CustomSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      {children}
    </Suspense>
  );
}

export const AppRoutes = () => {
  const { session } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<CustomSuspense><LazyRoutes.Index /></CustomSuspense>} />
      <Route path="/recipes" element={<CustomSuspense><LazyRoutes.Recipes /></CustomSuspense>} />
      <Route path="/recipes/:slug" element={<CustomSuspense><LazyRoutes.RecipeDetail /></CustomSuspense>} />
      <Route path="/quick-recipe" element={<CustomSuspense><LazyRoutes.QuickRecipePage /></CustomSuspense>} />
      <Route path="/recipe-preview" element={<CustomSuspense><LazyRoutes.RecipePreviewPage /></CustomSuspense>} />
      <Route path="/loading" element={<CustomSuspense><LazyRoutes.LoadingPage /></CustomSuspense>} />
      <Route path="/auth" element={<CustomSuspense><LazyRoutes.Auth /></CustomSuspense>} />
      <Route path="/how-it-works" element={<CustomSuspense><LazyRoutes.HowItWorks /></CustomSuspense>} />
      {/* Add new route for article detail pages */}
      <Route path="/how-it-works/:slug" element={<CustomSuspense><LazyRoutes.ArticleDetail /></CustomSuspense>} />
      <Route path="/articles/:slug" element={<CustomSuspense><LazyRoutes.ArticleDetail /></CustomSuspense>} />
      <Route path="/faq" element={<CustomSuspense><LazyRoutes.FAQ /></CustomSuspense>} />
      <Route path="/about" element={<CustomSuspense><LazyRoutes.About /></CustomSuspense>} />
      <Route path="/contact" element={<CustomSuspense><LazyRoutes.Contact /></CustomSuspense>} />
      <Route path="/privacy" element={<CustomSuspense><LazyRoutes.Privacy /></CustomSuspense>} />
      <Route path="/terms" element={<CustomSuspense><LazyRoutes.Terms /></CustomSuspense>} />
      <Route path="/cookies" element={<CustomSuspense><LazyRoutes.Cookies /></CustomSuspense>} />
      
      {/* Protected Routes */}
      <Route path="/profile" element={<PrivateRoute><CustomSuspense><LazyRoutes.Profile /></CustomSuspense></PrivateRoute>} />
      <Route path="/shopping-lists" element={<PrivateRoute><CustomSuspense><LazyRoutes.ShoppingLists /></CustomSuspense></PrivateRoute>} />
      {/* Add new route for shopping list details */}
      <Route path="/shopping-lists/:id" element={<PrivateRoute><CustomSuspense><LazyRoutes.ShoppingLists /></CustomSuspense></PrivateRoute>} />
      <Route path="/favorites" element={<PrivateRoute><CustomSuspense><LazyRoutes.Favorites /></CustomSuspense></PrivateRoute>} />
      <Route path="/import" element={<PrivateRoute><CustomSuspense><LazyRoutes.DataImport /></CustomSuspense></PrivateRoute>} />
      
      {/* Fallback Routes */}
      <Route path="*" element={<CustomSuspense><LazyRoutes.NotFound /></CustomSuspense>} />
    </Routes>
  );
};

export default AppRoutes;
