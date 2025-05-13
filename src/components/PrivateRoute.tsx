
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { cleanupUIState } from '@/utils/dom-cleanup';
import { toast } from 'sonner';
import { authStateManager } from '@/lib/auth/auth-state-manager';

interface RouteConfig {
  path: string;
  public: boolean;
}

// Definition of routes and their authentication requirements
const ROUTE_CONFIG: RouteConfig[] = [
  { path: '/quick-recipe', public: true },
  { path: '/', public: true },
  { path: '/recipes', public: true },
  { path: '/recipe/', public: true },
  { path: '/recipe-preview', public: true },
  { path: '/loading', public: true },
  { path: '/auth', public: true },
  { path: '/how-it-works', public: true },
  { path: '/articles/', public: true },
  { path: '/faq', public: true },
  { path: '/about', public: true },
  { path: '/contact', public: true },
  { path: '/privacy', public: true },
  { path: '/terms', public: true },
  { path: '/cookies', public: true },
];

// Protected resource paths that require authentication
const PROTECTED_PATHS = [
  '/profile',
  '/shopping-lists',
  '/favorites',
  '/import'
];

/**
 * Check if the given path is a public route
 */
function isPublicRoute(path: string): boolean {
  return ROUTE_CONFIG.some(route => 
    route.public && (path === route.path || path.startsWith(route.path))
  );
}

/**
 * Check if the given path is a protected resource
 */
function isProtectedResource(path: string): boolean {
  return PROTECTED_PATHS.some(protectedPath => path.startsWith(protectedPath));
}

/**
 * Safely store redirect information with validation
 * to prevent open redirect vulnerabilities
 */
function safelyStoreRedirect(pathname: string, options: {
  search?: string, 
  hash?: string, 
  state?: unknown
}): void {
  // Only store internal paths (no protocol/domain/etc)
  if (pathname.startsWith('/')) {
    authStateManager.setRedirectAfterAuth(pathname, options);
    console.log("Storing redirect location:", pathname);
  } else {
    console.warn("Attempted to store potentially unsafe redirect:", pathname);
    // Default to home page for safety
    authStateManager.setRedirectAfterAuth('/', options);
  }
}

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const location = useLocation();

  // Check if the current route is public
  const currentRouteIsPublic = isPublicRoute(location.pathname);

  // Clean up UI state when this component mounts, but don't remove active loading overlays
  useEffect(() => {
    // Check if there's an active loading overlay before cleanup
    const hasActiveLoadingOverlay = document.querySelector('.loading-overlay.active-loading');
    if (!hasActiveLoadingOverlay) {
      // Only clean up if there's no active loading overlay
      cleanupUIState();
    }
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If route is public or user is authenticated, render children
  if (currentRouteIsPublic || session) {
    return <>{children}</>;
  }

  // For private routes when not authenticated
  if (!session) {
    // Check for active loading overlay before cleaning up UI state
    const hasActiveLoadingOverlay = document.querySelector('.loading-overlay.active-loading');
    if (!hasActiveLoadingOverlay) {
      // Only clean up if there's no active loading overlay
      cleanupUIState();
    }
    
    // Store the current full location before redirecting to login
    console.log("Not authenticated, redirecting to login from:", location.pathname);
    
    // Check if we're on a protected resource page that requires auth
    const pathRequiresAuth = isProtectedResource(location.pathname);
    
    // Only show the auth toast for protected resources
    if (pathRequiresAuth) {
      toast.error("Please sign in to access this page");
    }
    
    // Store the current location for redirect after authentication
    safelyStoreRedirect(location.pathname, {
      search: location.search,
      hash: location.hash,
      state: location.state
    });
    
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
