
import React, { useState, useEffect, useRef } from 'react';
import { CookingPot, CircleCheck, PartyPopper, AlarmClock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { LoadingTipCard } from './loading/LoadingTipCard';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { useSoundEffect } from '@/hooks/use-sound-effect';
import { useAuth } from '@/hooks/use-auth';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils'; // Import the cn utility

// Array of loading step descriptions
const LOADING_STEPS = [
  "Analyzing your ingredients...",
  "Finding compatible recipes...",
  "Calculating measurements...",
  "Optimizing cooking techniques...",
  "Adding scientific insights...",
  "Finalizing your perfect recipe..."
];

// Loading phases with associated percentages - ensures we never reach 100% until complete
const LOADING_PHASES = [
  { name: "preparation", percentage: 25 },
  { name: "processing", percentage: 60 },
  { name: "finalizing", percentage: 85 },
  { name: "complete", percentage: 100 }
];

// Maximum time to wait before showing error (in seconds)
const MAX_LOADING_TIME = 40;

export function QuickRecipeLoading() {
  const { 
    loadingState, 
    formData, 
    updateLoadingState, 
    completedLoading, 
    setCompletedLoading, 
    setError, 
    reset 
  } = useQuickRecipeStore();
  
  const isMobile = useIsMobile();
  const { session } = useAuth();
  const [showFinalAnimation, setShowFinalAnimation] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  // Refs for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutWarningRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);
  
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
    
    // Create an AbortController for potential request cancellation
    abortControllerRef.current = new AbortController();
    
    return () => {
      if (timeoutWarningRef.current) {
        clearTimeout(timeoutWarningRef.current);
      }
      if (timeoutTimerRef.current) {
        clearTimeout(timeoutTimerRef.current);
      }
      // Abort any pending requests on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [completedLoading, pauseTypingSound, setError]);
  
  // Progress through loading phases instead of linear percentage
  useEffect(() => {
    if (completedLoading) {
      setCurrentPhase(LOADING_PHASES.length - 1);
      return;
    }
    
    // Start with the first phase
    setCurrentPhase(0);
    
    // Setup timers to advance through phases
    const phaseTimes = [6000, 15000, 12000]; // Times for each phase in ms
    let currentTime = 0;
    
    for (let i = 0; i < LOADING_PHASES.length - 1; i++) {
      currentTime += phaseTimes[i];
      
      phaseTimerRef.current = setTimeout(() => {
        if (!completedLoading) {
          setCurrentPhase(i + 1);
          
          // Update the loading state
          updateLoadingState({
            percentComplete: LOADING_PHASES[i + 1].percentage,
            estimatedTimeRemaining: MAX_LOADING_TIME - (currentTime / 1000)
          });
        }
      }, currentTime);
    }
    
    return () => {
      // Clear all phase timers on unmount
      if (phaseTimerRef.current) {
        clearTimeout(phaseTimerRef.current);
      }
    };
  }, [completedLoading, updateLoadingState]);
  
  // Start typing sound if audio is enabled
  useEffect(() => {
    if ((audioEnabled || !isMobile) && !completedLoading) {
      playTypingSound();
    }
    
    return () => {
      pauseTypingSound();
    };
  }, [audioEnabled, isMobile, completedLoading, playTypingSound, pauseTypingSound]);
  
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
  
  // Handle completion
  useEffect(() => {
    if (completedLoading && !showFinalAnimation) {
      // Stop typing sound
      pauseTypingSound();
      // Show final animation
      setShowFinalAnimation(true);
      
      // Clear all timers
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    }
  }, [completedLoading, pauseTypingSound, showFinalAnimation]);
  
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
  
  // Get current phase percentage
  const getCurrentProgress = () => {
    if (showFinalAnimation) return 100;
    return LOADING_PHASES[currentPhase].percentage;
  };
  
  // Function to handle cancellation request
  const handleCancel = () => {
    // Abort any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Clear all timers
    if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
    if (timeoutWarningRef.current) clearTimeout(timeoutWarningRef.current);
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    
    // Stop audio
    pauseTypingSound();
    
    // Reset the store state
    reset();
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-5 sm:py-8 w-full max-w-md mx-auto animate-fadeIn">
      <div className="flex flex-col items-center space-y-4 sm:space-y-6 text-center">
        {/* Animated cooking pot icon or completion animation */}
        <div className="relative">
          {showFinalAnimation ? (
            <div className="flex items-center justify-center">
              <CircleCheck className="h-12 w-12 text-recipe-green animate-scale-in" />
              <PartyPopper className="absolute -top-2 -right-2 h-6 w-6 text-recipe-orange animate-bounce" />
            </div>
          ) : (
            <>
              <CookingPot className="h-12 w-12 text-primary animate-spin" />
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
        
        {/* Progress indicator */}
        <div className="w-full max-w-xs">
          <Progress 
            value={getCurrentProgress()}
            indeterminate={!showFinalAnimation && currentPhase === 1} // Use indeterminate during the processing phase
            className="h-2"
            indicatorClassName={cn(
              showFinalAnimation ? "bg-recipe-green" : undefined,
              currentPhase === 1 && !showFinalAnimation ? "animate-pulse" : undefined
            )}
          />
          <p className="text-xs mt-1 text-muted-foreground text-right">
            {showFinalAnimation ? "100% Complete" : 
              LOADING_PHASES[currentPhase].name === "processing" ? "Processing..." : 
              formatTimeRemaining(loadingState.estimatedTimeRemaining)}
          </p>
        </div>
        
        {/* Timeout warning */}
        {showTimeout && !showFinalAnimation && (
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/10 py-2 px-3 rounded-lg mt-2">
            <AlarmClock className="h-4 w-4" />
            <span>This is taking longer than usual. Please be patient...</span>
          </div>
        )}
        
        {/* Cancel button */}
        <button
          onClick={handleCancel}
          className="mt-2 text-sm text-muted-foreground hover:text-destructive transition-colors focus:outline-none"
        >
          Cancel
        </button>
        
        {/* Smart tip card */}
        <div className="w-full max-w-xs animate-fade-in">
          <LoadingTipCard />
        </div>
      </div>
    </div>
  );
}
