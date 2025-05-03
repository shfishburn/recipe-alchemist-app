
import React, { Suspense } from 'react';
import { Routes, Route } from "react-router-dom";
import { PageLoadingFallback } from "@/components/ui/PageLoadingFallback";
import PrivateRoute from "@/components/PrivateRoute";
import * as LazyRoutes from "@/routes/LazyRoutes";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <Suspense fallback={<PageLoadingFallback />}>
          <LazyRoutes.Index />
        </Suspense>
      } />
      <Route path="/recipes" element={
        <Suspense fallback={<PageLoadingFallback />}>
          <LazyRoutes.Recipes />
        </Suspense>
      } />
      <Route path="/recipes/:id" element={
        <Suspense fallback={<PageLoadingFallback />}>
          <LazyRoutes.RecipeDetail />
        </Suspense>
      } />
      <Route path="/quick-recipe" element={
        <Suspense fallback={<PageLoadingFallback />}>
          <LazyRoutes.QuickRecipePage />
        </Suspense>
      } />
      <Route path="/how-it-works" element={
        <Suspense fallback={<PageLoadingFallback />}>
          <LazyRoutes.HowItWorks />
        </Suspense>
      } />
      <Route path="/how-it-works/:slug" element={
        <Suspense fallback={<PageLoadingFallback />}>
          <LazyRoutes.ArticleDetail />
        </Suspense>
      } />
      <Route path="/faq" element={
        <Suspense fallback={<PageLoadingFallback />}>
          <LazyRoutes.FAQ />
        </Suspense>
      } />
      <Route path="/about" element={
        <Suspense fallback={<PageLoadingFallback />}>
          <LazyRoutes.About />
        </Suspense>
      } />
      <Route path="/contact" element={
        <Suspense fallback={<PageLoadingFallback />}>
          <LazyRoutes.Contact />
        </Suspense>
      } />
      <Route path="/privacy" element={
        <Suspense fallback={<PageLoadingFallback />}>
          <LazyRoutes.Privacy />
        </Suspense>
      } />
      <Route path="/terms" element={
        <Suspense fallback={<PageLoadingFallback />}>
          <LazyRoutes.Terms />
        </Suspense>
      } />
      <Route path="/cookies" element={
        <Suspense fallback={<PageLoadingFallback />}>
          <LazyRoutes.Cookies />
        </Suspense>
      } />
      <Route
        path="/build"
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <LazyRoutes.Build />
          </Suspense>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Suspense fallback={<PageLoadingFallback />}>
              <LazyRoutes.Profile />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/shopping-lists"
        element={
          <PrivateRoute>
            <Suspense fallback={<PageLoadingFallback />}>
              <LazyRoutes.ShoppingLists />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/shopping-lists/:id"
        element={
          <PrivateRoute>
            <Suspense fallback={<PageLoadingFallback />}>
              <LazyRoutes.ShoppingLists />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <PrivateRoute>
            <Suspense fallback={<PageLoadingFallback />}>
              <LazyRoutes.Favorites />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/data-import"
        element={
          <PrivateRoute>
            <Suspense fallback={<PageLoadingFallback />}>
              <LazyRoutes.DataImport />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route path="*" element={
        <Suspense fallback={<PageLoadingFallback />}>
          <LazyRoutes.NotFound />
        </Suspense>
      } />
    </Routes>
  );
};
