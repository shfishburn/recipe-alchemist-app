
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { Footer } from "@/components/ui/footer";
import PrivateRoute from "@/components/PrivateRoute";
import { PageTransition } from "@/components/ui/page-transition";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

import Index from "./pages/Index";
import Build from "./pages/Build";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Profile from "./pages/Profile";
import ShoppingLists from "./pages/ShoppingLists";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import HowItWorks from "./pages/HowItWorks";
import ArticleDetail from "./pages/ArticleDetail";
import FAQ from "./pages/FAQ";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      meta: {
        onError: (error: Error) => {
          console.error('Query error:', error);
        },
      },
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <LoadingIndicator />
            <PageTransition>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/recipes/:id" element={<RecipeDetail />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/how-it-works/:slug" element={<ArticleDetail />} />
                <Route path="/faq" element={<FAQ />} />
                <Route
                  path="/build"
                  element={
                    <PrivateRoute>
                      <Build />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/shopping-lists"
                  element={
                    <PrivateRoute>
                      <ShoppingLists />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/favorites"
                  element={
                    <PrivateRoute>
                      <Favorites />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
            <Footer />
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
