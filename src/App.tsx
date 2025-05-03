
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { AuthProvider } from '@/hooks/use-auth';
import { CookieConsentProvider } from '@/hooks/use-cookie-consent';
import { Toaster } from '@/components/ui/toaster';
import { LoadingScreen } from '@/components/ui/loading-screen';

const Home = lazy(() => import('@/pages/Home'));
const Profile = lazy(() => import('@/pages/Profile'));
const Recipes = lazy(() => import('@/pages/Recipes'));
const RecipeDetail = lazy(() => import('@/pages/RecipeDetail'));
const HowItWorks = lazy(() => import('@/pages/HowItWorks'));
const ShoppingLists = lazy(() => import('@/pages/ShoppingLists'));
const QuickRecipe = lazy(() => import('@/pages/QuickRecipe'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Contact = lazy(() => import('@/pages/Contact'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Terms = lazy(() => import('@/pages/Terms'));
const Cookies = lazy(() => import('@/pages/Cookies'));

function App() {
  return (
    <CookieConsentProvider>
      <AuthProvider>
        <Router>
          <SiteHeader />
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/recipes/:id/:slug?" element={<RecipeDetail />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/shopping-lists" element={<ShoppingLists />} />
              <Route path="/quick-recipe" element={<QuickRecipe />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <SiteFooter />
          <Toaster />
        </Router>
      </AuthProvider>
    </CookieConsentProvider>
  );
}

export default App;
