
import React from 'react';
import { Utensils, ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';
import '@/styles/loading.css';

interface MaterialLoadingAnimationProps {
  progress: number;
  showChefTip?: boolean;
  variant?: 'primary' | 'secondary';
}

export function MaterialLoadingAnimation({ 
  progress, 
  showChefTip = false,
  variant = 'primary'
}: MaterialLoadingAnimationProps) {
  // Determine animation stages based on progress
  const isStirring = progress > 10;
  const isSteaming = progress > 20;
  const isNearlyDone = progress > 85;

  // Chef tips with Material Design typography
  const chefTips = [
    "The best flavors take time to develop.",
    "Patience is the secret ingredient in every great recipe.",
    "Good things are worth waiting for!",
    "We're crafting the perfect recipe for you."
  ];
  
  // State for chef tips rotation
  const [tipIndex, setTipIndex] = React.useState(0);
  
  // Rotate chef tips every 5 seconds
  React.useEffect(() => {
    if (!showChefTip) return;
    
    const tipInterval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % chefTips.length);
    }, 5000);
    
    return () => clearInterval(tipInterval);
  }, [showChefTip]);
  
  // Create deterministic bubbles
  const bubbles = Array.from({ length: 6 }).map((_, index) => {
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
          opacity: progress > 30 ? 0.7 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
        aria-hidden="true"
      />
    );
  });

  return (
    <div className="relative flex flex-col items-center hw-accelerated" aria-hidden="true">
      {/* Main animation container */}
      <div className="relative mb-4">
        {/* Cooking pot SVG - now with Material Design styling */}
        <svg 
          width="96" 
          height="96" 
          viewBox="0 0 96 96" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
          className={cn(
            "relative z-10 transition-transform",
            isStirring ? "animate-cooking-pot" : "",
            "drop-shadow-md"
          )}
        >
          {/* Pot body - Material Design elevation */}
          <path 
            d="M72 40H24V72C24 75.3137 26.6863 78 30 78H66C69.3137 78 72 75.3137 72 72V40Z" 
            fill={variant === 'primary' ? "#ECEFF1" : "#D1D5DB"}
            className="transition-colors duration-300"
          />
          
          {/* Pot rim - Material primary/accent color */}
          <path 
            d="M66 40H30C26.6863 40 24 37.3137 24 34C24 30.6863 26.6863 28 30 28H66C69.3137 28 72 30.6863 72 34C72 37.3137 69.3137 40 66 40Z" 
            fill={variant === 'primary' ? "#4CAF50" : "#9b87f5"} 
            className="transition-colors duration-300"
          />
          
          {/* Left handle */}
          <path 
            d="M48 28C48 21.3726 42.6274 16 36 16C29.3726 16 24 21.3726 24 28" 
            stroke={variant === 'primary' ? "#4CAF50" : "#9b87f5"}
            strokeWidth="4" 
            strokeLinecap="round"
            className="transition-colors duration-300" 
          />
          
          {/* Right handle */}
          <path 
            d="M48 28C48 21.3726 53.3726 16 60 16C66.6274 16 72 21.3726 72 28" 
            stroke={variant === 'primary' ? "#4CAF50" : "#9b87f5"}
            strokeWidth="4" 
            strokeLinecap="round"
            className="transition-colors duration-300" 
          />
          
          {/* Material Design surface highlight */}
          <path 
            d="M30 65C30 65 35 70 48 70C61 70 66 65 66 65" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            opacity="0.5" 
          />

          {/* Lid for pot when nearly done - Material elevation */}
          {isNearlyDone && (
            <path 
              d="M72 36H24C24 32 30 28 48 28C66 28 72 32 72 36Z" 
              fill={variant === 'primary' ? "#BDBDBD" : "#9CA3AF"}
              opacity="0.9"
              className="transition-colors duration-300"
            />
          )}
        </svg>
        
        {/* Steam particles with Material motion */}
        {isSteaming && (
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
            <div className="steam steam-1"></div>
            <div className="steam steam-2"></div>
            <div className="steam steam-3"></div>
          </div>
        )}
        
        {/* Bubbles with Material motion principles */}
        {bubbles}
        
        {/* Icon beneath pot - uses variant color */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 transition-colors duration-300">
          {isNearlyDone ? (
            <ChefHat className={cn(
              "h-6 w-6",
              variant === 'primary' ? "text-recipe-green" : "text-primary"
            )} />
          ) : (
            <Utensils className={cn(
              "h-6 w-6",
              variant === 'primary' ? "text-recipe-green" : "text-primary"
            )} />
          )}
        </div>
      </div>
      
      {/* Material Design linear progress indicator */}
      {progress > 0 && (
        <div className="mt-4 w-full max-w-xs">
          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-300 ease-out",
                variant === 'primary' 
                  ? "bg-recipe-green animate-progress-pulse" 
                  : "bg-primary animate-pulse"
              )}
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            />
          </div>
        </div>
      )}

      {/* Chef tip with Material Design typography */}
      {showChefTip && (
        <div className={cn(
          "mt-4 text-center px-3 py-2 rounded-md text-sm",
          "border border-gray-100 dark:border-gray-800",
          "shadow-sm bg-background/50 backdrop-blur-sm",
          "animate-fade-in transition-all duration-300"
        )}>
          <em className="font-normal text-gray-600 dark:text-gray-300">{chefTips[tipIndex]}</em>
        </div>
      )}
    </div>
  );
}

export default MaterialLoadingAnimation;
