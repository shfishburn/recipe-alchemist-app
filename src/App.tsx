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

// Import the AdminPage
import AdminPage from './pages/AdminPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Shell />}>
      <Route index element={<HomePage />} />
      <Route path="recipe/:idOrSlug" element={<RecipeDetailPage />} />
      <Route path="chat/:recipeId" element={<RecipeChatPage />} />
      <Route path="*" element={<NotFoundPage />} />
      {/* Add the admin route to the routes array */}
      <Route
        path="/admin"
        element={<AdminPage />}
      />
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
