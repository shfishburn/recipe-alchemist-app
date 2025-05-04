
import React, { useState, useEffect, useRef } from 'react';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { useAuth } from '@/hooks/use-auth';
import { LoadingAnimation } from './loading/LoadingAnimation';
import { LoadingProgress } from './loading/LoadingProgress';
import { TimeoutWarning } from './loading/TimeoutWarning';
import { LoadingTipCard } from './loading/LoadingTipCard';
import { useLoadingSound } from './loading/useLoadingSound';
import { useIsMobile } from '@/hooks/use-mobile';

// Array of loading step descriptions
const LOADING_STEPS = [
  "Analyzing your ingredients...",
  "Finding compatible recipes...",
  "Calculating measurements...",
  "Optimizing cooking techniques...",
  "Adding scientific insights...",
  "Finalizing your perfect recipe..."
];

// Maximum time to wait before showing error (in seconds)
const MAX_LOADING_TIME = 40;

export function QuickRecipeLoading() {
  const { loadingState, formData, updateLoadingState, completedLoading, setCompletedLoading, setError } = useQuickRecipeStore();
  const isMobile = useIsMobile();
  const { session } = useAuth();
  const [showFinalAnimation, setShowFinalAnimation] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutWarningRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use our custom hook for sound management
  const { audioEnabled, playTypingSound, pauseTypingSound } = useLoadingSound({ completedLoading });
  
  // Set a timeout to prevent infinite loading
  useEffect(() => {
    // Show a timeout warning after 75% of the maximum time
    timeoutWarningRef.current = setTimeout(() => {
      if (!completedLoading) {
        setShowTimeout(true);
      }
    }, (MAX_LOADING_TIME * 0.75) * 1000);
    
    // Set a timeout to prevent infinite loading state
    timeoutTimerRef.current = setTimeout(() => {
      if (!completedLoading) {
        console.error("Recipe generation timeout after", MAX_LOADING_TIME, "seconds");
        pauseTypingSound();
        setError("Recipe generation timed out. Please try again.");
      }
    }, MAX_LOADING_TIME * 1000);
    
    return () => {
      if (timeoutWarningRef.current) {
        clearTimeout(timeoutWarningRef.current);
      }
      if (timeoutTimerRef.current) {
        clearTimeout(timeoutTimerRef.current);
      }
    };
  }, [completedLoading, pauseTypingSound, setError]);
  
  // Update progress every second
  useEffect(() => {
    if (!loadingState.estimatedTimeRemaining) return;
    
    const startTime = Date.now();
    const initialEstimate = loadingState.estimatedTimeRemaining;
    
    // Start typing sound if audio is enabled
    if (audioEnabled || !isMobile) {
      playTypingSound();
    }
    
    progressTimerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, initialEstimate - elapsed);
      const percent = Math.min(99, Math.floor(((initialEstimate - remaining) / initialEstimate) * 100));
      
      updateLoadingState({ 
        estimatedTimeRemaining: remaining,
        percentComplete: percent 
      });
      
      // If almost done, show completion animation
      if (remaining <= 0.5 && !completedLoading) {
        setCompletedLoading(true);
        // Stop typing sound
        pauseTypingSound();
        // Show final animation
        setShowFinalAnimation(true);
        
        // Clear interval
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
          progressTimerRef.current = null;
        }
      }
    }, 100);
    
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      pauseTypingSound();
    };
  }, [loadingState.estimatedTimeRemaining, playTypingSound, pauseTypingSound, updateLoadingState, completedLoading, setCompletedLoading, audioEnabled, isMobile]);
  
  // Cycle through loading steps
  useEffect(() => {
    stepTimerRef.current = setInterval(() => {
      updateLoadingState({
        step: (loadingState.step + 1) % LOADING_STEPS.length,
        stepDescription: LOADING_STEPS[(loadingState.step + 1) % LOADING_STEPS.length]
      });
    }, 3000);
    
    return () => {
      if (stepTimerRef.current) {
        clearInterval(stepTimerRef.current);
        stepTimerRef.current = null;
      }
    };
  }, [loadingState.step, updateLoadingState]);
  
  // If main ingredient is complex like "chicken thighs", just use the first word for display
  const getSimpleIngredientName = () => {
    if (!formData?.mainIngredient) return 'recipe';
    const firstWord = formData.mainIngredient.split(' ')[0];
    return firstWord.toLowerCase();
  };
  
  // Personalized message
  const getUserMessage = () => {
    const ingredient = getSimpleIngredientName();
    const userName = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0];
    
    if (userName) {
      return `Creating ${ingredient} recipe for ${userName}`;
    }
    
    return `Creating your ${ingredient} recipe`;
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-5 sm:py-8 w-full max-w-md mx-auto animate-fadeIn">
      <div className="flex flex-col items-center space-y-4 sm:space-y-6 text-center">
        {/* Animated cooking pot icon or completion animation */}
        <div className="relative">
          <LoadingAnimation showFinalAnimation={showFinalAnimation} />
        </div>
        
        {/* Personalized message */}
        <h2 className="text-lg sm:text-xl font-semibold">
          {showFinalAnimation ? "Recipe ready!" : getUserMessage()}
        </h2>
        
        {/* Step description */}
        <p className="text-sm text-muted-foreground">
          {showFinalAnimation ? "Your perfect recipe has been created." : loadingState.stepDescription}
        </p>
        
        {/* Progress indicator */}
        <LoadingProgress 
          showFinalAnimation={showFinalAnimation}
          percentComplete={loadingState.percentComplete}
          estimatedTimeRemaining={loadingState.estimatedTimeRemaining}
        />
        
        {/* Timeout warning */}
        <TimeoutWarning 
          showTimeout={showTimeout} 
          showFinalAnimation={showFinalAnimation} 
        />
        
        {/* Smart tip card */}
        <div className="w-full max-w-xs animate-fade-in">
          <LoadingTipCard />
        </div>
      </div>
    </div>
  );
}
