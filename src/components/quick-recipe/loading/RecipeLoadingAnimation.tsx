
import React from 'react';
import { Utensils } from 'lucide-react';

interface RecipeLoadingAnimationProps {
  progress?: number;
}

/**
 * Recipe loading animation component
 * Displays an animation indicating the loading progress of a recipe.
 * The component renders a cooking pot with bubbles and steam effects that
 * change based on the progress value.
 * 
 * @param {object} props - Component props
 * @param {number} [props.progress=0] - Loading progress (0-100)
 * @returns {JSX.Element} Recipe loading animation with visual feedback
 */
export function RecipeLoadingAnimation({ progress = 0 }: RecipeLoadingAnimationProps) {
  // Validate the progress range
  const validProgress = Math.max(0, Math.min(100, progress));
  if (progress !== validProgress) {
    console.warn(`Progress should be between 0 and 100, received: ${progress}. Clamping to ${validProgress}.`);
  }
  
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
        className="absolute rounded-full bg-white/60"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${leftPosition}%`,
          bottom: '32%',
          animation: `bubble ${duration}s ease-in infinite`,
          animationDelay: `${delay}s`,
        }}
        aria-hidden="true"
      />
    );
  });

  return (
    <div className="relative flex flex-col items-center" aria-hidden="true">
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
          className="relative z-10"
        >
          {/* Pot body */}
          <path 
            d="M72 40H24V72C24 75.3137 26.6863 78 30 78H66C69.3137 78 72 75.3137 72 72V40Z" 
            fill="#D1D5DB" 
            className={validProgress > 10 ? "animate-pulse" : ""}
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
          
          {/* Optional: Add a highlight to the pot */}
          <path 
            d="M30 65C30 65 35 70 48 70C61 70 66 65 66 65" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            opacity="0.5" 
          />
        </svg>
        
        {/* Steam particles with tailwind animations */}
        <div className="absolute -top-2 left-1/4 w-2 h-2 bg-white/80 rounded-full animate-ping opacity-75 delay-75"></div>
        <div className="absolute -top-3 left-1/2 w-2 h-2 bg-white/80 rounded-full animate-ping opacity-75 delay-150"></div>
        <div className="absolute -top-4 left-3/4 w-2 h-2 bg-white/80 rounded-full animate-ping opacity-75 delay-300"></div>
        
        {/* Bubbles that appear when progress > 30% */}
        {showBubbles && bubbles}
        
        {/* Chef hat icon beneath pot */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-recipe-green">
          <Utensils className="h-6 w-6" />
        </div>
      </div>
      
      {/* Progress indicator */}
      {validProgress > 0 && (
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-recipe-green h-1.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${validProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}
