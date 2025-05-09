
import React, { Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";

import { Shell } from "@/components/shell";
import { HomePage } from "@/pages/HomePage";
import { RecipeDetailPage } from "@/pages/RecipeDetailPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { RecipeChatPage } from '@/pages/RecipeChatPage';
import AdminPage from '@/pages/AdminPage';

// Import lazy components from LazyRoutes
import * as LazyRoutes from "@/routes/LazyRoutes";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Shell />}>
      <Route index element={<HomePage />} />
      <Route path="recipe/:idOrSlug" element={<RecipeDetailPage />} />
      <Route path="chat/:recipeId" element={<RecipeChatPage />} />
      <Route path="admin" element={<AdminPage />} />
      
      {/* Add routes from AppRoutes.tsx */}
      <Route path="/recipes" element={
        <Suspense fallback={<LoadingIndicator />}>
          <LazyRoutes.Recipes />
        </Suspense>
      } />
      <Route path="/recipes/:id" element={
        <Suspense fallback={<LoadingIndicator />}>
          <LazyRoutes.RecipeDetail />
        </Suspense>
      } />
      <Route path="/quick-recipe" element={
        <Suspense fallback={<LoadingIndicator />}>
          <LazyRoutes.QuickRecipePage />
        </Suspense>
      } />
      <Route path="/how-it-works" element={
        <Suspense fallback={<LoadingIndicator />}>
          <LazyRoutes.HowItWorks />
        </Suspense>
      } />
      <Route path="/how-it-works/:slug" element={
        <Suspense fallback={<LoadingIndicator />}>
          <LazyRoutes.ArticleDetail />
        </Suspense>
      } />
      <Route path="/faq" element={
        <Suspense fallback={<LoadingIndicator />}>
          <LazyRoutes.FAQ />
        </Suspense>
      } />
      <Route path="/about" element={
        <Suspense fallback={<LoadingIndicator />}>
          <LazyRoutes.About />
        </Suspense>
      } />
      <Route path="/contact" element={
        <Suspense fallback={<LoadingIndicator />}>
          <LazyRoutes.Contact />
        </Suspense>
      } />
      <Route path="/privacy" element={
        <Suspense fallback={<LoadingIndicator />}>
          <LazyRoutes.Privacy />
        </Suspense>
      } />
      <Route path="/terms" element={
        <Suspense fallback={<LoadingIndicator />}>
          <LazyRoutes.Terms />
        </Suspense>
      } />
      <Route path="/cookies" element={
        <Suspense fallback={<LoadingIndicator />}>
          <LazyRoutes.Cookies />
        </Suspense>
      } />
      <Route path="/profile" element={
        <Suspense fallback={<LoadingIndicator />}>
          <LazyRoutes.Profile />
        </Suspense>
      } />
      <Route path="/shopping-lists" element={
        <Suspense fallback={<LoadingIndicator />}>
          <LazyRoutes.ShoppingLists />
        </Suspense>
      } />
      <Route path="/shopping-lists/:id" element={
        <Suspense fallback={<LoadingIndicator />}>
          <LazyRoutes.ShoppingLists />
        </Suspense>
      } />
      <Route path="/favorites" element={
        <Suspense fallback={<LoadingIndicator />}>
          <LazyRoutes.Favorites />
        </Suspense>
      } />
      <Route path="/data-import" element={
        <Suspense fallback={<LoadingIndicator />}>
          <LazyRoutes.DataImport />
        </Suspense>
      } />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

function App() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
