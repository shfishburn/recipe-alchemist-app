import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { AuthProvider } from '@/hooks/use-auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { NutritionProvider } from '@/contexts/NutritionContext';
import { HelmetProvider } from 'react-helmet-async';

// Lazy load pages
const Index = lazy(() => import('@/pages/Index'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Profile = lazy(() => import('@/pages/Profile'));
const RecipeDetails = lazy(() => import('@/pages/RecipeDetails'));
const RecipeCreatePage = lazy(() => import('@/pages/RecipeCreatePage'));
const Recipes = lazy(() => import('@/pages/Recipes'));
const ShoppingLists = lazy(() => import('@/pages/ShoppingLists'));
const ShoppingListDetails = lazy(() => import('@/pages/ShoppingListDetails'));
const DataImport = lazy(() => import('@/pages/DataImport'));

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <NutritionProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/recipes/:id" element={<RecipeDetails />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/recipes/create" element={<RecipeCreatePage />} />
                  <Route path="/shopping-lists" element={<ShoppingLists />} />
                  <Route path="/shopping-lists/:id" element={<ShoppingListDetails />} />
                  <Route path="/data-import" element={<DataImport />} />
                </Route>
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
            <Toaster />
          </NutritionProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
