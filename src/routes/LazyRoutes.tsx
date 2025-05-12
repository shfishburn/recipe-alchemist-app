
import { lazy } from "react";

// Pre-existing lazy routes
export const Index = lazy(() => import("@/pages/Index"));
export const Recipes = lazy(() => import("@/pages/Recipes"));
export const RecipeDetail = lazy(() => import("@/pages/RecipeDetail"));
export const QuickRecipePage = lazy(() => import("@/pages/QuickRecipePage"));
export const Auth = lazy(() => import("@/pages/Auth"));
export const HowItWorks = lazy(() => import("@/pages/HowItWorks"));
export const ArticleDetail = lazy(() => import("@/pages/ArticleDetail"));
export const FAQ = lazy(() => import("@/pages/FAQ"));
export const About = lazy(() => import("@/pages/About"));
export const Contact = lazy(() => import("@/pages/Contact"));
export const Privacy = lazy(() => import("@/pages/Privacy"));
export const Terms = lazy(() => import("@/pages/Terms"));
export const Cookies = lazy(() => import("@/pages/Cookies"));
export const Profile = lazy(() => import("@/pages/Profile"));
export const ShoppingLists = lazy(() => import("@/pages/ShoppingLists"));
export const Favorites = lazy(() => import("@/pages/Favorites"));
export const DataImport = lazy(() => import("@/pages/DataImport"));
export const NotFound = lazy(() => import("@/pages/NotFound"));

// Loading page route
export const LoadingPage = lazy(() => import("@/pages/LoadingPage"));

// New Recipe Preview page route
export const RecipePreviewPage = lazy(() => import("@/pages/RecipePreviewPage"));
