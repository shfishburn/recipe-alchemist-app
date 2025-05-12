
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '@/components/PrivateRoute';
import * as LazyRoutes from '@/routes/LazyRoutes';
import { useAuth } from '@/hooks/use-auth';

export const AppRoutes = () => {
  const { session } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Suspense fallback={<div>Loading...</div>}><LazyRoutes.Index /></Suspense>} />
      <Route path="/recipes" element={<Suspense fallback={<div>Loading...</div>}><LazyRoutes.Recipes /></Suspense>} />
      
      {/* Redirect all recipe detail routes to quick recipe page */}
      <Route path="/recipes/:slug" element={<Navigate to="/quick-recipe" replace />} />
      <Route path="/recipe-detail" element={<Navigate to="/quick-recipe" replace />} />
      <Route path="/recipe-detail/:slug" element={<Navigate to="/quick-recipe" replace />} />
      
      <Route path="/quick-recipe" element={<Suspense fallback={<div>Loading...</div>}><LazyRoutes.QuickRecipePage /></Suspense>} />
      <Route path="/recipe-preview" element={<Suspense fallback={<div>Loading...</div>}><LazyRoutes.RecipePreviewPage /></Suspense>} />
      <Route path="/loading" element={<Suspense fallback={<div>Loading...</div>}><LazyRoutes.LoadingPage /></Suspense>} />
      <Route path="/auth" element={<Suspense fallback={<div>Loading...</div>}><LazyRoutes.Auth /></Suspense>} />
      <Route path="/how-it-works" element={<Suspense fallback={<div>Loading...</div>}><LazyRoutes.HowItWorks /></Suspense>} />
      <Route path="/articles/:slug" element={<Suspense fallback={<div>Loading...</div>}><LazyRoutes.ArticleDetail /></Suspense>} />
      <Route path="/faq" element={<Suspense fallback={<div>Loading...</div>}><LazyRoutes.FAQ /></Suspense>} />
      <Route path="/about" element={<Suspense fallback={<div>Loading...</div>}><LazyRoutes.About /></Suspense>} />
      <Route path="/contact" element={<Suspense fallback={<div>Loading...</div>}><LazyRoutes.Contact /></Suspense>} />
      <Route path="/privacy" element={<Suspense fallback={<div>Loading...</div>}><LazyRoutes.Privacy /></Suspense>} />
      <Route path="/terms" element={<Suspense fallback={<div>Loading...</div>}><LazyRoutes.Terms /></Suspense>} />
      <Route path="/cookies" element={<Suspense fallback={<div>Loading...</div>}><LazyRoutes.Cookies /></Suspense>} />
      
      {/* Protected Routes */}
      <Route path="/profile" element={<PrivateRoute><Suspense fallback={<div>Loading...</div>}><LazyRoutes.Profile /></Suspense></PrivateRoute>} />
      <Route path="/shopping-lists" element={<PrivateRoute><Suspense fallback={<div>Loading...</div>}><LazyRoutes.ShoppingLists /></Suspense></PrivateRoute>} />
      <Route path="/favorites" element={<PrivateRoute><Suspense fallback={<div>Loading...</div>}><LazyRoutes.Favorites /></Suspense></PrivateRoute>} />
      <Route path="/import" element={<PrivateRoute><Suspense fallback={<div>Loading...</div>}><LazyRoutes.DataImport /></Suspense></PrivateRoute>} />
      
      {/* Fallback Routes */}
      <Route path="*" element={<Suspense fallback={<div>Loading...</div>}><LazyRoutes.NotFound /></Suspense>} />
    </Routes>
  );
};

export default AppRoutes;
