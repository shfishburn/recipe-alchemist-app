
import React, { useEffect, useState } from 'react';
import { Utensils, ChefHat } from 'lucide-react';
import '@/styles/loading.css';

interface RecipeLoadingAnimationProps {
  progress?: number;
  showChefTip?: boolean;
}

/**
 * Recipe loading animation component
 * Displays an animation indicating the loading progress of a recipe.
 * The component renders a cooking pot with bubbles and steam effects that
 * change based on the progress value.
 */
export function RecipeLoadingAnimation({ 
  progress = 0, 
  showChefTip = false 
}: RecipeLoadingAnimationProps) {
  // State for chef tips rotation
  const [tipIndex, setTipIndex] = useState(0);
  const chefTips = [
    "The best flavors take time to develop.",
    "Patience is the secret ingredient in every great recipe.",
    "Good things are worth waiting for!",
    "We're simmering your ideas into the perfect recipe."
  ];
  
  // Rotate chef tips every 5 seconds
  useEffect(() => {
    if (!showChefTip) return;
    
    const tipInterval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % chefTips.length);
    }, 5000);
    
    return () => clearInterval(tipInterval);
  }, [showChefTip]);
  
  // Validate the progress range
  const validProgress = Math.max(0, Math.min(100, progress));
  
  // Create bubbles with deterministic properties
  const numBubbles = 6;
  const showBubbles = validProgress > 30;
  
  const bubbles = Array.from({ length: numBubbles }).map((_, index) => {
    // Use deterministic calculations for consistent but varied bubbles
    const size = 4 + (index % 3) * 2;
    const leftPosition = 30 + (index % 4) * 10;
    const delay = (index % 3) * 0.2;
    const duration = 1.5 + (index % 3) * 0.2;
    
    return (
      <div
        key={`bubble-${index}`}
        className="absolute rounded-full bg-white/60 hw-accelerated"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${leftPosition}%`,
          bottom: '32%',
          animation: `bubble ${duration}s ease-in infinite`,
          animationDelay: `${delay}s`,
          opacity: showBubbles ? 0.7 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
        aria-hidden="true"
      />
    );
  });

  // Determine animation stages based on progress
  const isStirring = validProgress > 10;
  const isSteaming = validProgress > 20;
  const isNearlyDone = validProgress > 85;

  return (
    <div className="relative flex flex-col items-center hw-accelerated" aria-hidden="true">
      <div className="relative">
        {/* Cooking pot SVG */}
        <svg 
          width="96" 
          height="96" 
          viewBox="0 0 96 96" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
          className={`relative z-10 ${isStirring ? "animate-cooking-pot" : ""}`}
        >
          {/* Pot body */}
          <path 
            d="M72 40H24V72C24 75.3137 26.6863 78 30 78H66C69.3137 78 72 75.3137 72 72V40Z" 
            fill="#D1D5DB" 
          />
          
          {/* Pot rim */}
          <path 
            d="M66 40H30C26.6863 40 24 37.3137 24 34C24 30.6863 26.6863 28 30 28H66C69.3137 28 72 30.6863 72 34C72 37.3137 69.3137 40 66 40Z" 
            fill="#4CAF50" 
          />
          
          {/* Left handle */}
          <path 
            d="M48 28C48 21.3726 42.6274 16 36 16C29.3726 16 24 21.3726 24 28" 
            stroke="#4CAF50" 
            strokeWidth="4" 
            strokeLinecap="round" 
          />
          
          {/* Right handle */}
          <path 
            d="M48 28C48 21.3726 53.3726 16 60 16C66.6274 16 72 21.3726 72 28" 
            stroke="#4CAF50" 
            strokeWidth="4" 
            strokeLinecap="round" 
          />
          
          {/* Highlight on the pot */}
          <path 
            d="M30 65C30 65 35 70 48 70C61 70 66 65 66 65" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            opacity="0.5" 
          />

          {/* Lid for pot when nearly done */}
          {isNearlyDone && (
            <path 
              d="M72 36H24C24 32 30 28 48 28C66 28 72 32 72 36Z" 
              fill="#9CA3AF" 
              opacity="0.8"
            />
          )}
        </svg>
        
        {/* Steam particles using proper CSS classes */}
        {isSteaming && (
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
            <div className="steam steam-1"></div>
            <div className="steam steam-2"></div>
            <div className="steam steam-3"></div>
          </div>
        )}
        
        {/* Bubbles that appear when progress > 30% */}
        {bubbles}
        
        {/* Chef hat or utensils icon beneath pot */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-recipe-green">
          {isNearlyDone ? (
            <ChefHat className="h-6 w-6 text-recipe-green" />
          ) : (
            <Utensils className="h-6 w-6" />
          )}
        </div>
      </div>
      
      {/* Progress indicator */}
      {validProgress > 0 && (
        <div className="mt-4 w-full max-w-xs">
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-recipe-green rounded-full transition-all duration-300 ease-out animate-progress-pulse"
              style={{ width: `${validProgress}%` }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={validProgress}
            />
          </div>
        </div>
      )}

      {/* Chef tip that shows when enabled */}
      {showChefTip && (
        <div className="mt-4 text-center px-2 py-1 rounded-md bg-gray-50 text-sm text-gray-600 max-w-xs animate-fade-in">
          <em>{chefTips[tipIndex]}</em>
        </div>
      )}
    </div>
  );
}

// Export default for compatibility with lazy loading
export default RecipeLoadingAnimation;
