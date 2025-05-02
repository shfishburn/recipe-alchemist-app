
import "./styles/loading.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { Footer } from "@/components/ui/footer";
import PrivateRoute from "@/components/PrivateRoute";
import { PageTransition } from "@/components/ui/page-transition";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { DefaultSeo } from "@/components/seo/DefaultSeo";
import { Suspense, lazy } from "react";
import { useQuickRecipeStore } from "@/store/use-quick-recipe-store";

// Lazy load non-critical pages
const Index = lazy(() => import("./pages/Index"));
const Recipes = lazy(() => import("./pages/Recipes"));
const RecipeDetail = lazy(() => import("./pages/RecipeDetail"));
const Build = lazy(() => import("./pages/Build")); // Keeping this for backwards compatibility
const Profile = lazy(() => import("./pages/Profile"));
const ShoppingLists = lazy(() => import("./pages/ShoppingLists"));
const Favorites = lazy(() => import("./pages/Favorites"));
const NotFound = lazy(() => import("./pages/NotFound"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const FAQ = lazy(() => import("./pages/FAQ"));
const About = lazy(() => import("./pages/About"));
const QuickRecipePage = lazy(() => import("./pages/QuickRecipePage"));
const DataImport = lazy(() => import("./pages/DataImport"));

// Default loading fallback for lazy-loaded components
const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-center">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Configure QueryClient with enhanced caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000, // 30 seconds
      gcTime: 300000,   // 5 minutes
    },
  },
});

// Footer wrapper that conditionally renders based on quick recipe loading state
const FooterWrapper = () => {
  const { isLoading } = useQuickRecipeStore();
  const location = useLocation();
  
  // Don't render footer on the quick recipe page when loading
  if (location.pathname === '/quick-recipe' && isLoading) {
    return null;
  }
  
  return <Footer />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <DefaultSeo />
            <Toaster />
            <Sonner />
            <LoadingIndicator />
            <PageTransition>
              <Routes>
                <Route path="/" element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <Index />
                  </Suspense>
                } />
                <Route path="/recipes" element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <Recipes />
                  </Suspense>
                } />
                <Route path="/recipes/:id" element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <RecipeDetail />
                  </Suspense>
                } />
                <Route path="/quick-recipe" element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <QuickRecipePage />
                  </Suspense>
                } />
                <Route path="/how-it-works" element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <HowItWorks />
                  </Suspense>
                } />
                <Route path="/how-it-works/:slug" element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <ArticleDetail />
                  </Suspense>
                } />
                <Route path="/faq" element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <FAQ />
                  </Suspense>
                } />
                <Route path="/about" element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <About />
                  </Suspense>
                } />
                <Route
                  path="/build"
                  element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <Build />
                    </Suspense>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Suspense fallback={<PageLoadingFallback />}>
                        <Profile />
                      </Suspense>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/shopping-lists"
                  element={
                    <PrivateRoute>
                      <Suspense fallback={<PageLoadingFallback />}>
                        <ShoppingLists />
                      </Suspense>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/shopping-lists/:id"
                  element={
                    <PrivateRoute>
                      <Suspense fallback={<PageLoadingFallback />}>
                        <ShoppingLists />
                      </Suspense>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/favorites"
                  element={
                    <PrivateRoute>
                      <Suspense fallback={<PageLoadingFallback />}>
                        <Favorites />
                      </Suspense>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/data-import"
                  element={
                    <PrivateRoute>
                      <Suspense fallback={<PageLoadingFallback />}>
                        <DataImport />
                      </Suspense>
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <NotFound />
                  </Suspense>
                } />
              </Routes>
            </PageTransition>
            <FooterWrapper />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
