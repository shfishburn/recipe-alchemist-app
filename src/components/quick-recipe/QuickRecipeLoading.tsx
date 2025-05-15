// @ai-protect read-only
// This file contains critical loading animations and should be modified with care

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Clock, ChefHat } from 'lucide-react';
import '@/styles/loading.css';

interface QuickRecipeLoadingProps {
  onCancel?: () => void;
  timeoutWarning?: boolean;
  percentComplete: number;
  stepDescription: string;
}

// Array of rotating chef tips with improved writing style
const CHEF_TIPS = [
  "Listen, amigos - patience isn't just a virtue, it's the secret ingredient! The soul of flavor develops slowly, just like your recipe is taking shape now. Trust the process.",
  
  "Before you touch a single ingredient, read the entire recipe twice. Professional kitchens call this 'mise en place mental' - the preparation that happens in your head first.",
  
  "In my kitchen, we live by mise en place - organizing ingredients before cooking. This isn't just about order; it's about respect for the food and creating rhythm in your cooking.",
  
  "Taste constantly! Your palate is the most valuable tool. Seasoning gradually builds layers of flavor that sing together in harmony, not just noise.",
  
  "The magic happens at the finish line. Add fresh herbs at the end of cooking - they're not just garnish, they're the bright notes that make a dish memorable."
];

export function QuickRecipeLoading({ 
  onCancel, 
  timeoutWarning = false, 
  percentComplete, 
  stepDescription 
}: QuickRecipeLoadingProps) {
  // Current tip to display with animation states
  const [tipIndex, setTipIndex] = useState(0);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(true);
  
  // Estimated time remaining calculation
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  
  // Rotate tips with animation
  useEffect(() => {
    // Initial fade in
    const fadeInTimer = setTimeout(() => {
      setIsAnimatingIn(false);
    }, 1000);
    
    // Set up rotation interval
    const tipRotationInterval = setInterval(() => {
      // Start fade out animation
      setIsAnimatingOut(true);
      
      // After fade out completes, change tip and start fade in
      setTimeout(() => {
        setTipIndex(prev => (prev + 1) % CHEF_TIPS.length);
        setIsAnimatingOut(false);
        setIsAnimatingIn(true);
        
        // Complete fade in
        setTimeout(() => {
          setIsAnimatingIn(false);
        }, 1000);
      }, 1000);
    }, 8000); // Show each tip for 8 seconds total
    
    return () => {
      clearTimeout(fadeInTimer);
      clearInterval(tipRotationInterval);
    };
  }, []);
  
  // Calculate estimated time
  useEffect(() => {
    if (percentComplete > 5) {
      // Simple estimation based on current progress
      const remainingSecs = Math.ceil((100 - percentComplete) / (percentComplete * 0.1));
      setTimeRemaining(Math.min(remainingSecs, 120)); // Cap at 2 minutes
    }
  }, [percentComplete]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto overflow-x-hidden">
      <div className="flex flex-col items-center justify-center space-y-8 p-6 w-full">
        {/* Staub-inspired cooking pot animation */}
        <div 
          className="relative animate-float-gentle hw-accelerated" 
          aria-hidden="true"
          role="presentation"
        >
          <svg 
            width="140" 
            height="120" 
            viewBox="0 0 120 120" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="animate-pulse-subtle"
          >
            {/* Main pot body - dark green, more straight-sided */}
            <path d="M35 70C35 70 35 75 35 85C35 97 45 105 60 105C75 105 85 97 85 85C85 75 85 70 85 70" fill="#1E5631" />
            
            {/* Pot rim and top edge */}
            <rect x="35" y="68" width="50" height="4" fill="#0F3920" />
            <ellipse cx="60" cy="70" rx="25" ry="4" fill="#1E5631" />
            
            {/* Integrated cast iron style handles */}
            <path d="M35 74C35 74 30 74 28 77C26 80 28 84 31 84L35 84" fill="#1E5631" stroke="#0F3920" strokeWidth="1" />
            <path d="M85 74C85 74 90 74 92 77C94 80 92 84 89 84L85 84" fill="#1E5631" stroke="#0F3920" strokeWidth="1" />
            
            {/* Amber broth rather than green liquid */}
            <ellipse cx="60" cy="70" rx="23" ry="2" fill="#E6C17D" />
            
            {/* Subtle broth texture */}
            <path d="M45 69C45 69 50 70 55 69C60 68 65 69 70 70C75 69" stroke="#D4A76A" strokeWidth="0.5" opacity="0.7" />
            
            {/* Enhanced bubbles with glow effect */}
            <circle cx="48" cy="69" r="1.5" fill="white" opacity="0.8" className="animate-bubble-1" />
            <circle cx="48" cy="69" r="2" fill="white" opacity="0.3" className="animate-bubble-1" />
            
            <circle cx="60" cy="69.5" r="2" fill="white" opacity="0.8" className="animate-bubble-2" />
            <circle cx="60" cy="69.5" r="2.5" fill="white" opacity="0.3" className="animate-bubble-2" />
            
            <circle cx="72" cy="69" r="1.3" fill="white" opacity="0.8" className="animate-bubble-3" />
            <circle cx="72" cy="69" r="1.8" fill="white" opacity="0.3" className="animate-bubble-3" />
            
            {/* Staub-style lid with concentric circles and metal knob - updated with black top */}
            <g className="animate-lid-bobble">
              {/* Lid base */}
              <ellipse cx="60" cy="63" rx="25" ry="4" fill="#1E5631" />
              {/* Lid top - black */}
              <ellipse cx="60" cy="61" rx="23" ry="3" fill="#111111" />
              {/* Concentric circles - subtle dark gray against black */}
              <ellipse cx="60" cy="61" rx="18" ry="2" fill="none" stroke="#2A2A2A" strokeWidth="1" />
              <ellipse cx="60" cy="61" rx="12" ry="1.5" fill="none" stroke="#2A2A2A" strokeWidth="1" />
              <ellipse cx="60" cy="61" rx="6" ry="1" fill="none" stroke="#2A2A2A" strokeWidth="1" />
              {/* Metal knob */}
              <circle cx="60" cy="59" r="3" fill="#D1D5DB" />
              <circle cx="60" cy="59" r="1.5" fill="#9CA3AF" />
            </g>
            
            {/* Enhanced steam - thicker, more visible with shadow effects */}
            <path d="M45 55C45 55 43 45 48 40" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" className="animate-steam-1" />
            <path d="M60 50C60 50 58 40 63 35" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" className="animate-steam-2" />
            <path d="M75 55C75 55 73 45 78 40" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" className="animate-steam-3" />
            
            {/* Steam shadows for better contrast on white background */}
            <path d="M45 55C45 55 43 45 48 40" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round" opacity="0.2" className="animate-steam-1" />
            <path d="M60 50C60 50 58 40 63 35" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round" opacity="0.2" className="animate-steam-2" />
            <path d="M75 55C75 55 73 45 78 40" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round" opacity="0.2" className="animate-steam-3" />
          </svg>
        </div>
        
        {/* Cooking status and heading */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 animate-fade-in">
            Cooking Up Your Recipe
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 animate-fade-in max-w-md">
            {stepDescription}
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="w-full space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{Math.round(percentComplete)}%</span>
          </div>
          
          <Progress
            value={percentComplete}
            className="w-full h-2 animate-fade-in"
            aria-label="Recipe generation progress"
          />
          
          {/* Time remaining estimate */}
          {timeRemaining && (
            <div className="flex items-center justify-end mt-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3 mr-1" />
              <span>
                Est. {timeRemaining > 60 
                  ? `${Math.floor(timeRemaining / 60)}m ${timeRemaining % 60}s` 
                  : `${timeRemaining}s`} remaining
              </span>
            </div>
          )}
        </div>
        
        {/* Timeout warning - with improved styling */}
        {timeoutWarning && (
          <div className="flex items-center gap-3 text-amber-700 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/20 py-3 px-4 rounded-lg w-full border border-amber-200 dark:border-amber-800 animate-subtle-bounce">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>
              <strong>Taking longer than expected.</strong> Our chef is working extra hard on your recipe. Thank you for your patience.
            </span>
          </div>
        )}
        
        {/* Enhanced chef tip card with animations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md p-5 w-full transition-all duration-500 relative overflow-hidden">
          <div className="flex items-start space-x-3">
            <ChefHat className="h-6 w-6 text-recipe-green flex-shrink-0 mt-1 animate-pulse-attention" />
            <div>
              <h4 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-100">Chef's Tip</h4>
              <div className="min-h-[80px] relative">
                <p 
                  className={`text-sm text-gray-600 dark:text-gray-300 leading-relaxed absolute transition-all duration-1000 ${
                    isAnimatingOut 
                      ? 'opacity-0 transform -translate-y-4' 
                      : isAnimatingIn 
                        ? 'opacity-0 transform translate-y-4' 
                        : 'opacity-100 transform translate-y-0'
                  }`}
                >
                  {CHEF_TIPS[tipIndex]}
                </p>
              </div>
            </div>
          </div>
          
          {/* Tip indicator dots */}
          <div className="flex justify-center mt-4 space-x-1.5">
            {CHEF_TIPS.map((_, index) => (
              <div 
                key={index} 
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  index === tipIndex 
                    ? 'bg-recipe-green scale-125' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
        
        {/* Cancel button with improved styling */}
        <Button 
          variant="outline" 
          onClick={onCancel} 
          className="px-6 py-2 transition-all duration-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Cancel recipe creation"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}