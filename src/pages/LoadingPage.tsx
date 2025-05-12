
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, CookingPot } from 'lucide-react';
import { RecipeLoadingAnimation } from '@/components/quick-recipe/loading/RecipeLoadingAnimation';
import { ErrorState } from '@/components/quick-recipe/loading/ErrorState';

interface LocationState {
  fromQuickRecipePage?: boolean;
  error?: string;
  formData?: any;
  timestamp?: number;
}

const LoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState || {};
  
  // Check if we came from the QuickRecipePage
  const { fromQuickRecipePage = false, error = null, formData = null, timestamp = Date.now() } = state;
  
  // If not coming from QuickRecipePage, redirect to home
  useEffect(() => {
    if (!fromQuickRecipePage) {
      navigate('/', { replace: true });
    }
    
    // If there's an error, go back to quick recipe page after showing error
    if (error) {
      const timer = setTimeout(() => {
        navigate('/quick-recipe', { 
          state: { error, formData },
          replace: true 
        });
      }, 1500);
      
      return () => clearTimeout(timer);
    }
    
    // Auto-refresh effect - if loading takes too long, go back
    const maxLoadingTime = 45000; // 45 seconds max loading time
    const timeoutId = setTimeout(() => {
      navigate('/quick-recipe', { 
        state: { 
          error: "Recipe generation timed out. Please try again.",
          formData,
          hasTimeoutError: true
        },
        replace: true 
      });
    }, maxLoadingTime);
    
    // Poll the quick-recipe page status every few seconds
    const pollInterval = 2000; // 2 seconds
    const pollId = setInterval(() => {
      // We use the timestamp to avoid caching issues
      fetch(`/api/quick-recipe/status?t=${Date.now()}`)
        .then(response => response.json())
        .then(data => {
          if (data.status === 'completed' || data.status === 'error') {
            clearInterval(pollId);
            clearTimeout(timeoutId);
            navigate('/quick-recipe', { 
              state: { 
                timestamp: Date.now(),
                ...(data.status === 'error' && { error: data.message || 'An error occurred' })
              },
              replace: true 
            });
          }
        })
        .catch(err => console.error('Error polling recipe status:', err));
    }, pollInterval);
    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(pollId);
    };
  }, [navigate, fromQuickRecipePage, error, formData]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-6">
        {error ? (
          <ErrorState 
            error={error} 
            isRetrying={false}
          />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <RecipeLoadingAnimation />
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-semibold text-gray-800">Crafting Your Recipe</h2>
              <p className="text-sm text-gray-500">We're creating the perfect recipe with your ingredients...</p>
            </div>
            
            <div className="w-full max-w-xs mt-6">
              <div className="h-1 w-full bg-gray-200 rounded overflow-hidden">
                <div className="h-full bg-recipe-green animate-pulse w-full"></div>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 mt-2">This may take up to 45 seconds</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingPage;
