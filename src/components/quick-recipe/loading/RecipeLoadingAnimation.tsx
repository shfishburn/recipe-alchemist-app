
import React from 'react';
import { Spoon, ChefHat } from 'lucide-react';
import '@/styles/loading.css'; // Import animation styles

interface RecipeLoadingAnimationProps {
  stage?: number; // Current loading stage (0-4)
  progress?: number; // Current progress percentage
}

export function RecipeLoadingAnimation({ stage = 0, progress = 0 }: RecipeLoadingAnimationProps) {
  // Determine visibility based on stage/progress
  const showIngredients = stage >= 1 || progress >= 20;
  const showBubbles = stage >= 2 || progress >= 60;
  const showChefHat = stage >= 3 || progress >= 85;
  
  // Generate multiple steam particles for more realistic effect
  const steamParticles = Array(5).fill(0).map((_, index) => {
    const leftPosition = 20 + (index * 15); // Spread across the pot
    const delay = (index * 0.3); // Stagger animation start times
    
    return (
      <div 
        key={`steam-${index}`}
        className="steam"
        style={{
          left: `${leftPosition}%`,
          animationDelay: `${delay}s`,
          top: `-${10 + index * 2}px`
        }}
      />
    );
  });
  
  // Generate bubbles that appear when cooking progresses
  const bubbles = Array(6).fill(0).map((_, index) => {
    const size = 4 + Math.random() * 6;
    const leftPosition = 30 + (Math.random() * 40);
    const delay = index * 0.4;
    const duration = 1.5 + Math.random();
    
    return showBubbles ? (
      <div
        key={`bubble-${index}`}
        className="bubble"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${leftPosition}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`
        }}
      />
    ) : null;
  });
  
  // Generate ingredients that fall into the pot
  const ingredients = ['carrot', 'herb', 'spice'].map((type, index) => {
    return showIngredients ? (
      <div
        key={`ingredient-${index}`}
        className={`ingredient ingredient-${type}`}
        style={{ 
          animationDelay: `${index * 0.7}s`,
          left: `${25 + index * 20}%`
        }}
      />
    ) : null;
  });

  // Heat intensity based on progress
  const heatIntensity = Math.min(1, progress / 70);
  const potColor = `rgb(209, 213, 219)`; // Base gray color for the pot
  const rimColor = progress > 60 ? '#66BB6A' : '#4CAF50'; // Brightens as it cooks
  
  return (
    <div className="relative" aria-hidden="true">
      {/* Background glow for heat effect */}
      <div 
        className="absolute inset-0 rounded-full bg-orange-500 blur-xl opacity-20"
        style={{ 
          opacity: 0.1 + (heatIntensity * 0.3),
          transform: `scale(${1 + (heatIntensity * 0.15)})` 
        }}
      />
      
      {/* Cooking pot SVG with animations */}
      <div className="relative animate-cooking-pot">
        <svg 
          width="96" 
          height="96" 
          viewBox="0 0 96 96" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
        >
          {/* Pot body with subtle highlight based on progress */}
          <path 
            d="M72 40H24V72C24 75.3137 26.6863 78 30 78H66C69.3137 78 72 75.3137 72 72V40Z" 
            fill={potColor}
            className="pot-body"
          />
          
          {/* Pot rim that brightens as cooking progresses */}
          <path 
            d="M66 40H30C26.6863 40 24 37.3137 24 34C24 30.6863 26.6863 28 30 28H66C69.3137 28 72 30.6863 72 34C72 37.3137 69.3137 40 66 40Z" 
            fill={rimColor} 
            className="pot-rim"
          />
          
          {/* Left handle */}
          <path 
            d="M48 28C48 21.3726 42.6274 16 36 16C29.3726 16 24 21.3726 24 28" 
            stroke={rimColor} 
            strokeWidth="4" 
            strokeLinecap="round"
          />
          
          {/* Right handle */}
          <path 
            d="M48 28C48 21.3726 53.3726 16 60 16C66.6274 16 72 21.3726 72 28" 
            stroke={rimColor} 
            strokeWidth="4" 
            strokeLinecap="round"
          />
          
          {/* Water level that rises with progress */}
          <path 
            d="M28 42C28 42 44 46 68 42V68C68 71.3137 66.3137 72 63 72H33C29.6863 72 28 71.3137 28 68V42Z" 
            fill="#E5DEFF" 
            fillOpacity={0.3 + (progress / 200)}
            className="water-level"
          />
        </svg>

        {/* Animated spoon that stirs the pot */}
        {progress >= 30 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-[-40%] animate-stir">
            <Spoon size={24} className="text-gray-600" />
          </div>
        )}
        
        {/* Chef hat appears in later stages */}
        {showChefHat && (
          <div className="absolute -top-8 -right-8 animate-bounce-slow">
            <ChefHat size={28} className="text-white filter drop-shadow-md" />
          </div>
        )}

        {/* Ingredients that fall into the pot */}
        {ingredients}
        
        {/* Bubbles rising in the pot */}
        {bubbles}
      </div>
      
      {/* Steam particles rising from the pot */}
      <div className="relative">
        {steamParticles}
      </div>
      
      {/* Subtle sparkles of "cooking magic" */}
      {progress > 50 && Array(3).fill(0).map((_, i) => (
        <div 
          key={`sparkle-${i}`} 
          className="sparkle"
          style={{
            left: `${20 + i * 30}%`,
            top: `${10 + (i % 2) * 20}px`,
            animationDelay: `${i * 0.4}s`
          }}
        />
      ))}
    </div>
  );
}

