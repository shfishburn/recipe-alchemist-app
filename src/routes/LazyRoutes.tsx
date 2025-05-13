
import { lazy } from "react";

// Helper function to create a lazy component with error handling
const createLazyComponent = (importFn: () => Promise<any>) => {
  return lazy(() => 
    importFn()
      .catch(error => {
        console.error(`Error loading component:`, error);
        return { 
          default: () => (
            <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
              <h3 className="font-medium mb-2">Failed to load component</h3>
              <p className="text-sm">Please try again or contact support if this issue persists.</p>
            </div>
          )
        };
      })
  );
};

// Pre-existing lazy routes with improved error handling
export const Index = createLazyComponent(() => import("@/pages/Index"));
export const Recipes = createLazyComponent(() => import("@/pages/Recipes"));
export const RecipeDetail = createLazyComponent(() => import("@/pages/RecipeDetail"));
export const QuickRecipePage = createLazyComponent(() => import("@/pages/QuickRecipePage"));
export const Auth = createLazyComponent(() => import("@/pages/Auth"));
export const HowItWorks = createLazyComponent(() => import("@/pages/HowItWorks"));
export const ArticleDetail = createLazyComponent(() => import("@/pages/ArticleDetail"));
export const FAQ = createLazyComponent(() => import("@/pages/FAQ"));
export const About = createLazyComponent(() => import("@/pages/About"));
export const Contact = createLazyComponent(() => import("@/pages/Contact"));
export const Privacy = createLazyComponent(() => import("@/pages/Privacy"));
export const Terms = createLazyComponent(() => import("@/pages/Terms"));
export const Cookies = createLazyComponent(() => import("@/pages/Cookies"));
export const Profile = createLazyComponent(() => import("@/pages/Profile"));
export const ShoppingLists = createLazyComponent(() => import("@/pages/ShoppingLists"));
export const Favorites = createLazyComponent(() => import("@/pages/Favorites"));
export const DataImport = createLazyComponent(() => import("@/pages/DataImport"));
export const NotFound = createLazyComponent(() => import("@/pages/NotFound"));

// Loading page route
export const LoadingPage = createLazyComponent(() => import("@/pages/LoadingPage"));

// New Recipe Preview page route
export const RecipePreviewPage = createLazyComponent(() => import("@/pages/RecipePreviewPage"));
