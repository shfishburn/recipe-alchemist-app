
import React, { useState, useEffect, useRef } from 'react';
import { CookingPot, CircleCheck, PartyPopper } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSoundEffect } from '@/hooks/use-sound-effect';
import { Progress } from '@/components/ui/progress';
import { LoadingTipCard } from './loading/LoadingTipCard';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';

export function FullScreenLoading() {
  const { loadingState, updateLoadingState, completedLoading, setCompletedLoading, formData } = useQuickRecipeStore();
  const isMobile = useIsMobile();
  const [showFinalAnimation, setShowFinalAnimation] = useState(false);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  // Array of loading step descriptions for better user experience
  const LOADING_STEPS = [
    "Analyzing your ingredients...",
    "Finding compatible recipes...",
    "Calculating measurements...",
    "Optimizing cooking techniques...",
    "Adding scientific insights...",
    "Finalizing your perfect recipe..."
  ];
  
  // Initialize sound effect for typing with mobile-friendly settings
  const { play: playTypingSound, pause: pauseTypingSound } = useSoundEffect('/lovable-uploads/typing.mp3', {
    loop: true,
    volume: isMobile ? 0.5 : 0.3,
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
        pauseTypingSound();
        setShowFinalAnimation(true);
        
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
  
  // Get simple ingredient name
  const getSimpleIngredientName = () => {
    if (!formData?.mainIngredient) return 'recipe';
    const firstWord = formData.mainIngredient.split(' ')[0];
    return firstWord.toLowerCase();
  };
  
  // Format time remaining
  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return "Recipe ready!";
    if (seconds < 10) return `${Math.ceil(seconds)} seconds left`;
    return `About ${Math.ceil(seconds)} seconds`;
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-5">
      <div className="flex flex-col items-center space-y-6 text-center">
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
          {showFinalAnimation ? "Recipe ready!" : `Creating your ${getSimpleIngredientName()} recipe`}
        </h2>
        
        {/* Step description */}
        <p className="text-sm text-muted-foreground">
          {showFinalAnimation ? "Your perfect recipe has been created." : loadingState.stepDescription}
        </p>
        
        {/* Progress indicator */}
        <div className="w-full max-w-xs">
          <Progress 
            value={showFinalAnimation ? 100 : loadingState.percentComplete} 
            className="h-2"
            indicatorClassName={showFinalAnimation ? "bg-recipe-green" : undefined}
          />
          <p className="text-xs mt-1 text-muted-foreground text-right">
            {showFinalAnimation ? "100% Complete" : formatTimeRemaining(loadingState.estimatedTimeRemaining)}
          </p>
        </div>
        
        {/* Smart tip card */}
        <div className="w-full max-w-xs animate-fade-in">
          <LoadingTipCard />
        </div>
      </div>
    </div>
  );
}
