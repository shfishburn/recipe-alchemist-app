
// Commit: remove thin bar & Chef's Tip, add fade-in animation via Framer Motion
import React, { useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuickRecipe } from '@/hooks/use-quick-recipe';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

/**
 * Standalone loading page that completely replaces the app layout
 * This page exists outside the normal layout hierarchy
 */
const LoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    error, 
    recipe, 
    isLoading, 
    formData,
    reset, 
    hasTimeoutError,
    setLoading,
    setError,
  } = useQuickRecipeStore();
  
  const { generateQuickRecipe } = useQuickRecipe();
  
  const [progress, setProgress] = React.useState(10);
  const [showTimeoutMessage, setShowTimeoutMessage] = React.useState(false);
  const [isRetrying, setIsRetrying] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const [hasNetworkIssue, setHasNetworkIssue] = React.useState(false);
  const MAX_RETRIES = 3;
  
  // Store all timeout/interval IDs for cleanup
  const timers = useRef<number[]>([]);
  
  // Network status tracking
  useEffect(() => {
    const onChange = () => setHasNetworkIssue(!navigator.onLine);
    window.addEventListener('online', onChange);
    window.addEventListener('offline', onChange);
    setHasNetworkIssue(!navigator.onLine);
    return () => {
      window.removeEventListener('online', onChange);
      window.removeEventListener('offline', onChange);
    };
  }, []);
  
  // Redirect on success
  useEffect(() => {
    if (!isLoading && recipe) {
      navigate('/quick-recipe', { state: { fromLoading: true } });
    }
  }, [isLoading, recipe, navigate]);

  // Show timeout warning after 37s
  useEffect(() => {
    if (isLoading && !error) {
      const id = window.setTimeout(() => setShowTimeoutMessage(true), 37000);
      timers.current.push(id);
    }
  }, [isLoading, error]);

  // Progress simulation
  useEffect(() => {
    // Clear any prior timers
    timers.current.forEach(clearTimeout);
    timers.current = [];

    if (isLoading && !error) {
      setProgress(10);
      const steps = [
        { target: 20, delay: 1000 },
        { target: 35, delay: 3000 },
        { target: 50, delay: 6000 },
        { target: 65, delay: 11000 },
        { target: 80, delay: 19000 },
      ];
      steps.forEach(({ target, delay }) => {
        const id = window.setTimeout(() => setProgress(p => Math.max(p, target)), delay);
        timers.current.push(id);
      });
      const intervalId = window.setInterval(() => {
        setProgress(p => (p < 95 ? p + 0.2 : p));
      }, 1000);
      timers.current.push(intervalId);
    } else {
      setProgress(100);
    }

    return () => timers.current.forEach(id => clearTimeout(id));
  }, [isLoading, error]);

  const handleCancel = useCallback(() => {
    reset();
    navigate('/', { replace: true });
  }, [navigate, reset]);

  const handleRetry = useCallback(async () => {
    if (retryCount >= MAX_RETRIES) {
      toast({ 
        title: "Maximum retry limit reached", 
        description: "Please try again with different ingredients or options.", 
        variant: "destructive" 
      });
      return;
    }
    
    if (formData) {
      try {
        setIsRetrying(true);
        setError(null);
        setLoading(true);
        setRetryCount(c => c + 1);
        
        console.log("Retrying recipe generation with formData:", formData);
        
        await generateQuickRecipe(formData);
      } catch (error) {
        console.error("Error during retry:", error);
      } finally {
        setIsRetrying(false);
      }
    } else {
      navigate('/quick-recipe');
    }
  }, [formData, generateQuickRecipe, navigate, retryCount, setError, setLoading]);

  // Prevent body scroll
  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = orig; };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center w-full h-screen bg-white dark:bg-gray-950 overflow-hidden">
      <div className="w-full max-w-md p-6 flex flex-col items-center">
        {error || hasNetworkIssue ? (
          <div className="flex flex-col items-center space-y-4 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 animate-pulse" />
            <h2 className="text-xl font-semibold">
              {hasNetworkIssue ? "Network Connection Lost" : "Recipe Generation Failed"}
            </h2>
            <p className="text-muted-foreground">
              {hasNetworkIssue 
                ? "Please check your internet connection and try again."
                : error}
            </p>
            
            {hasTimeoutError && !hasNetworkIssue && (
              <div className="mt-4 p-3 rounded-lg text-sm bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">This request timed out</span>
                </div>
                <p className="text-xs">
                  Try again with a simpler recipe request or fewer ingredients.
                </p>
              </div>
            )}
            
            {retryCount > 0 && (
              <div className="text-xs text-muted-foreground mt-2">
                Retry attempt {retryCount} of {MAX_RETRIES}
              </div>
            )}
            
            <div className="flex flex-row gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Start Over
              </Button>
              
              {formData && retryCount < MAX_RETRIES && !hasNetworkIssue && (
                <Button 
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
                  Try Again
                </Button>
              )}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center w-full space-y-6"
          >
            <svg 
              width="120" 
              height="120" 
              viewBox="0 0 120 120" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="drop-shadow-md"
            >
              <rect x="30" y="45" width="60" height="60" rx="4" fill="#D1D5DB" className="dark:fill-gray-700" />
              <path d="M30 49a4 4 0 014-4h52a4 4 0 014 4v10H30V49z" fill="#4CAF50" />
              <path d="M60 45V30M50 37.5C50 32.8 54.5 25 60 30c5.5 5 10 2.5 10 7.5S65 45 60 45s-10-2.8-10-7.5z" stroke="#4CAF50" strokeWidth="3" />
              
              {/* Adding sparkle effects */}
              <circle cx="40" cy="60" r="2" fill="white" className="animate-pulse" />
              <circle cx="75" cy="65" r="1.5" fill="white" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
              <circle cx="55" cy="80" r="2" fill="white" className="animate-pulse" style={{ animationDelay: '0.8s' }} />
            </svg>
            
            <h2 className="text-2xl font-semibold bg-clip-text bg-gradient-to-r from-recipe-green to-recipe-blue text-transparent">
              Creating your recipe...
            </h2>
            
            <div className="w-full space-y-1">
              <Progress 
                value={progress}
                className="w-full h-2" 
                indicatorClassName="animate-progress-pulse" 
              />
              <div className="text-xs text-muted-foreground text-right">
                {progress.toFixed(0)}%
              </div>
            </div>
            
            {showTimeoutMessage && (
              <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800 p-4 w-full">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <h4 className="text-base font-medium text-amber-700 dark:text-amber-400">Taking longer than expected</h4>
                </div>
                <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
                  Our AI is working hard—thanks for your patience!
                </p>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              onClick={handleCancel} 
              className="text-gray-500"
            >
              Cancel
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LoadingPage;
