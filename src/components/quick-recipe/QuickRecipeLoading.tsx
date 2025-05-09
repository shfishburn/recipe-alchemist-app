
import React, { useState, useEffect, useRef } from 'react';
import { CookingPot, CircleCheck, PartyPopper, AlarmClock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { LoadingTipCard } from './loading/LoadingTipCard';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { useSoundEffect } from '@/hooks/use-sound-effect';
import { useAuth } from '@/hooks/use-auth';
import { Progress } from '@/components/ui/progress';

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
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  // Initialize sound effect for typing with mobile-friendly settings
  const { play: playTypingSound, pause: pauseTypingSound } = useSoundEffect('/lovable-uploads/typing.mp3', {
    loop: true,
    volume: isMobile ? 0.5 : 0.3, // Higher volume for mobile
    enabled: true
  });
  
  // Enable audio after a user interaction on mobile
  useEffect(() => {
    const enableAudio = () => {
      if (!audioEnabled) {
        setAudioEnabled(true);
        // Try to play audio now that we have user interaction
        if (!completedLoading) {
          playTypingSound();
        }
        // Remove listener once enabled
        document.removeEventListener('touchstart', enableAudio);
        document.removeEventListener('click', enableAudio);
      }
    };

    // Add listeners for user interaction
    document.addEventListener('touchstart', enableAudio);
    document.addEventListener('click', enableAudio);
    
    return () => {
      document.removeEventListener('touchstart', enableAudio);
      document.removeEventListener('click', enableAudio);
    };
  }, [audioEnabled, completedLoading, playTypingSound]);
  
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
  
  // Format time remaining
  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return "Recipe ready!";
    if (seconds < 10) return `${Math.ceil(seconds)} seconds left`;
    return `About ${Math.ceil(seconds)} seconds`;
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-5 sm:py-8 w-full animate-fadeIn">
      <div className="flex flex-col items-center space-y-4 sm:space-y-6 text-center w-full max-w-md mx-auto">
        {/* Animated cooking pot icon or completion animation */}
        <div className="relative">
          {showFinalAnimation ? (
            <div className="flex items-center justify-center">
              <CircleCheck className="h-12 w-12 text-recipe-green animate-scale-in" />
              <PartyPopper className="absolute -top-2 -right-2 h-6 w-6 text-recipe-orange animate-bounce" />
            </div>
          ) : (
            <>
              <CookingPot className="h-12 w-12 text-primary animate-bounce" />
              <div className="absolute -top-2 -right-2 h-3 w-3 bg-recipe-orange rounded-full animate-ping" />
            </>
          )}
        </div>
        
        {/* Personalized message */}
        <h2 className="text-lg sm:text-xl font-semibold">
          {showFinalAnimation ? "Recipe ready!" : getUserMessage()}
        </h2>
        
        {/* Step description */}
        <p className="text-sm text-muted-foreground">
          {showFinalAnimation ? "Your perfect recipe has been created." : loadingState.stepDescription}
        </p>
        
        {/* Progress indicator - Full width container */}
        <div className="w-full">
          <Progress 
            value={showFinalAnimation ? 100 : loadingState.percentComplete} 
            className="h-2"
            indicatorClassName={showFinalAnimation ? "bg-recipe-green" : undefined}
          />
          <p className="text-xs mt-1 text-muted-foreground text-right">
            {showFinalAnimation ? "100% Complete" : formatTimeRemaining(loadingState.estimatedTimeRemaining)}
          </p>
        </div>
        
        {/* Timeout warning */}
        {showTimeout && !showFinalAnimation && (
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/10 py-2 px-3 rounded-lg mt-2 w-full">
            <AlarmClock className="h-4 w-4" />
            <span>This is taking longer than usual. Please be patient...</span>
          </div>
        )}
        
        {/* Smart tip card - Uses full width of parent container */}
        <div className="w-full animate-fade-in">
          <LoadingTipCard />
        </div>
      </div>
    </div>
  );
}
