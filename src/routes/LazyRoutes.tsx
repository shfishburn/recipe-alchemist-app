
import { lazy, Suspense } from "react";
import { PageLoadingFallback } from '@/components/ui/PageLoadingFallback';
import { ErrorBoundary } from '@/components/ui/error-boundary';

// Utility function that adds better error handling and retries to lazy loading
const createLazyComponent = (importFn: () => Promise<any>, retries = 3) => {
  const LazyComponent = lazy(() => {
    let attempt = 0;

    const attemptImport = async (): Promise<any> => {
      try {
        return await importFn();
      } catch (error) {
        if (error instanceof Error && error.message.includes('Failed to fetch dynamically imported module') && attempt < retries) {
          console.log(`Retrying import attempt ${attempt + 1}/${retries}`);
          attempt += 1;
          // Exponential backoff retry with jitter
          const jitter = Math.random() * 500;
          const delay = Math.min(1000 * Math.pow(2, attempt) + jitter, 8000);
          await new Promise(resolve => setTimeout(resolve, delay));
          return attemptImport();
        }
        console.error('Module loading failed:', error);
        throw error;
      }
    };

    return attemptImport();
  });

  return (props: any) => (
    <ErrorBoundary fallback={<div className="p-8 text-center">
      <h2 className="text-xl font-semibold mb-2">Failed to load component</h2>
      <p className="text-muted-foreground">There was an error loading this page.</p>
      <button 
        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
        onClick={() => window.location.reload()}
      >
        Try refreshing
      </button>
    </div>}>
      <Suspense fallback={<PageLoadingFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

// Lazy load non-critical pages with enhanced error handling
export const Index = createLazyComponent(() => import("@/pages/Index"));
export const Recipes = createLazyComponent(() => import("@/pages/Recipes"));
export const RecipeDetail = createLazyComponent(() => import("@/pages/RecipeDetail"));
export const Profile = createLazyComponent(() => import("@/pages/Profile"));
export const ShoppingLists = createLazyComponent(() => import("@/pages/ShoppingLists"));
export const Favorites = createLazyComponent(() => import("@/pages/Favorites"));
export const NotFound = createLazyComponent(() => import("@/pages/NotFound"));
export const HowItWorks = createLazyComponent(() => import("@/pages/HowItWorks"));
export const ArticleDetail = createLazyComponent(() => import("@/pages/ArticleDetail"));
export const FAQ = createLazyComponent(() => import("@/pages/FAQ"));
export const About = createLazyComponent(() => import("@/pages/About"));
export const Contact = createLazyComponent(() => import("@/pages/Contact"));
export const Privacy = createLazyComponent(() => import("@/pages/Privacy"));
export const Terms = createLazyComponent(() => import("@/pages/Terms"));
export const Cookies = createLazyComponent(() => import("@/pages/Cookies"));
export const QuickRecipePage = createLazyComponent(() => import("@/pages/QuickRecipePage"));
export const DataImport = createLazyComponent(() => import("@/pages/DataImport"));
export const Auth = createLazyComponent(() => import("@/pages/Auth"));
