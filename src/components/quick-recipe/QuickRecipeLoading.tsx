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

// Array of rotating chef tips
const CHEF_TIPS = [
  "Patience is key in cooking. The best flavors take time to develop, just like your recipe is taking shape now.",
  "Professional chefs read through the entire recipe before starting. It helps avoid surprises midway.",
  "Mise en place (preparing ingredients before cooking) can save you valuable time and reduce cooking stress.",
  "Always taste as you go. Seasoning gradually builds better flavors than adding all at once.",
  "When possible, use fresh herbs at the end of cooking for the brightest flavor."
];

export function QuickRecipeLoading({ 
  onCancel, 
  timeoutWarning = false, 
  percentComplete, 
  stepDescription 
}: QuickRecipeLoadingProps) {
  // Rotating chef tips
  const [tipIndex, setTipIndex] = useState(0);
  
  // Estimated time remaining calculation
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  
  // Rotate tips every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % CHEF_TIPS.length);
    }, 8000);
    
    return () => clearInterval(interval);
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
        {/* Animated cooking pot boiling over */}
        <div 
          className="relative animate-float-gentle hw-accelerated" 
          aria-hidden="true"
          role="presentation"
        >
          <svg 
            width="140" 
            height="140" 
            viewBox="0 0 140 140" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="animate-pulse-subtle"
          >
            {/* Stove burner */}
            <circle cx="70" cy="105" r="25" fill="#4B5563" />
            <circle cx="70" cy="105" r="20" fill="#6B7280" strokeWidth="2" stroke="#9CA3AF" strokeDasharray="3 3" className="animate-spin-slow" />
            
            {/* Pot body */}
            <path d="M40 80C40 80 35 90 35 100C35 110 45 115 70 115C95 115 105 110 105 100C105 90 100 80 100 80H40Z" fill="#374151" />
            <path d="M38 80H102C102 80 108 75 108 70C108 65 102 60 102 60H38C38 60 32 65 32 70C32 75 38 80 38 80Z" fill="#6B7280" />

            {/* Pot handles */}
            <path d="M32 70C32 70 25 68 25 75C25 82 32 80 32 80" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" />
            <path d="M108 70C108 70 115 68 115 75C115 82 108 80 108 80" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" />
            
            {/* Boiling water inside pot */}
            <path d="M42 80C42 80 45 85 70 85C95 85 98 80 98 80" fill="#4CAF50" />
            <ellipse cx="70" cy="80" rx="28" ry="6" fill="#4CAF50" />
            
            {/* Bubbles in the water - animated */}
            <circle cx="55" cy="77" r="2" fill="white" opacity="0.6" className="animate-bubble-1" />
            <circle cx="65" cy="78" r="3" fill="white" opacity="0.7" className="animate-bubble-2" />
            <circle cx="78" cy="76" r="2.5" fill="white" opacity="0.6" className="animate-bubble-3" />
            <circle cx="85" cy="79" r="1.5" fill="white" opacity="0.7" className="animate-bubble-4" />
            <circle cx="50" cy="79" r="1.5" fill="white" opacity="0.5" className="animate-bubble-5" />
            
            {/* Boiling over effects */}
            <path d="M42 80C42 80 40 75 42 73C44 71 46 72 45 70C44 68 46 65 48 66" stroke="white" strokeWidth="2" strokeLinecap="round" className="animate-boil-over-1" />
            <path d="M98 80C98 80 100 75 98 73C96 71 94 72 95 70C96 68 94 65 92 66" stroke="white" strokeWidth="2" strokeLinecap="round" className="animate-boil-over-2" />
            
            {/* Steam clouds */}
            <path d="M50 55C50 55 45 50 47 45C49 40 54 42 55 38C56 34 60 32 63 35C66 38 64 42 67 43C70 44 71 48 68 50C65 52 62 48 60 50C58 52 55 52 53 50" fill="#E5E7EB" opacity="0.7" className="animate-steam-1" />
            
            <path d="M75 50C75 50 70 45 72 40C74 35 79 37 80 33C81 29 85 27 88 30C91 33 89 37 92 38C95 39 96 43 93 45C90 47 87 43 85 45C83 47 80 47 78 45" fill="#E5E7EB" opacity="0.7" className="animate-steam-2" />
            
            <path d="M60 40C60 40 58 35 60 32C62 29 65 31 65 28C65 25 68 24 70 26C72 28 70 30 72 31C74 32 75 34 73 36C71 38 69 36 68 37C67 38 65 38 64 37" fill="#E5E7EB" opacity="0.6" className="animate-steam-3" />
            
            {/* Lid bobbing from pressure */}
            <ellipse cx="70" cy="60" rx="30" ry="5" fill="#4B5563" className="animate-lid-bobble" />
            <circle cx="70" cy="58" r="4" fill="#6B7280" />
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
        
        {/* Enhanced chef tip card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md p-5 w-full transition-all duration-500">
          <div className="flex items-start space-x-3">
            <ChefHat className="h-6 w-6 text-recipe-green flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-100">Chef's Tip</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {CHEF_TIPS[tipIndex]}
              </p>
            </div>
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