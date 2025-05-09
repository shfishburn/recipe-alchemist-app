
import { lazy } from "react";

// Lazy load non-critical pages
export const Index = lazy(() => import("@/pages/Index"));
export const Recipes = lazy(() => import("@/pages/Recipes"));
export const RecipeDetail = lazy(() => import("@/pages/RecipeDetail"));
export const Profile = lazy(() => import("@/pages/Profile"));
export const ShoppingLists = lazy(() => import("@/pages/ShoppingLists"));
export const Favorites = lazy(() => import("@/pages/Favorites"));
export const NotFound = lazy(() => import("@/pages/NotFound"));
export const HowItWorks = lazy(() => import("@/pages/HowItWorks"));
export const ArticleDetail = lazy(() => import("@/pages/ArticleDetail"));
export const FAQ = lazy(() => import("@/pages/FAQ"));
export const About = lazy(() => import("@/pages/About"));
export const Contact = lazy(() => import("@/pages/Contact"));
export const Privacy = lazy(() => import("@/pages/Privacy"));
export const Terms = lazy(() => import("@/pages/Terms"));
export const Cookies = lazy(() => import("@/pages/Cookies"));
export const QuickRecipePage = lazy(() => import("@/pages/QuickRecipePage"));
export const DataImport = lazy(() => import("@/pages/DataImport"));
export const Auth = lazy(() => import("@/pages/Auth"));
