
import React, { Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/components/layout/AppLayout';

// Pages
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const PrivacyPage = React.lazy(() => import('@/pages/PrivacyPage'));
const TermsPage = React.lazy(() => import('@/pages/TermsPage'));
const HowItWorksPage = React.lazy(() => import('@/pages/HowItWorksPage'));
const ArticlePage = React.lazy(() => import('@/pages/ArticlePage'));
const ShoppingListPage = React.lazy(() => import('@/pages/ShoppingListPage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));
const ImportPage = React.lazy(() => import('@/pages/ImportPage'));
const QuickRecipePage = React.lazy(() => import('@/pages/QuickRecipePage'));
const LoadingPage = React.lazy(() => import('@/pages/LoadingPage'));
const RecipeDetailPage = React.lazy(() => import('@/pages/RecipeDetailPage'));
const RecipeModifyPage = React.lazy(() => import('@/pages/RecipeModifyPage'));
const PrintRecipePage = React.lazy(() => import('@/pages/PrintRecipePage'));
const QuickShoppingListPage = React.lazy(() => import('@/pages/QuickShoppingListPage'));
const CookingModePage = React.lazy(() => import('@/pages/CookingModePage'));

// Removed BuildPage import as it's no longer needed

import PrivateRoute from '@/components/PrivateRoute';
import './App.css';

function App() {
  const location = useLocation();
  const { refreshSession } = useAuth();

  useEffect(() => {
    // Initialize auth
    refreshSession();
  }, [refreshSession]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/how-it-works/:slug" element={<ArticlePage />} />
          <Route path="/shopping-list" element={<PrivateRoute><ShoppingListPage /></PrivateRoute>} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/quick-recipe" element={<QuickRecipePage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/recipes/:id/modify" element={<PrivateRoute><RecipeModifyPage /></PrivateRoute>} />
          <Route path="/recipes/:id/print" element={<PrintRecipePage />} />
          <Route path="/recipes/:id/shopping-list" element={<QuickShoppingListPage />} />
          <Route path="/recipes/:id/cooking" element={<CookingModePage />} />
          
          {/* Removed BuildPage route as it's no longer needed */}
          
          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
