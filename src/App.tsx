import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import QuickRecipePage from './pages/QuickRecipePage';
import RecipeBuilderPage from './pages/RecipeBuilderPage';
import RecipePage from './pages/RecipePage';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './hooks/use-auth';
import { ToastProvider } from './hooks/use-toast';
import { RecipeProvider } from './hooks/use-recipe';
import { SearchProvider } from './hooks/use-search';
import { IngredientProvider } from './hooks/use-ingredient';
import { LibraryProvider } from './hooks/use-library';
import { ChatProvider } from './hooks/use-chat';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import CreateRecipePage from './components/quick-recipe/CreateRecipePage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <RecipeProvider>
            <SearchProvider>
              <IngredientProvider>
                <LibraryProvider>
                  <ChatProvider>
                    <Router>
                      <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/quick-recipe" element={<QuickRecipePage />} />
                        <Route path="/recipe-builder" element={<RecipeBuilderPage />} />
                        <Route path="/recipes/:id" element={<RecipePage />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/create-recipe" element={<CreateRecipePage />} />
                      </Routes>
                    </Router>
                  </ChatProvider>
                </LibraryProvider>
              </IngredientProvider>
            </SearchProvider>
          </RecipeProvider>
        </ToastProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
