
import React from 'react';

export function RecipeLoadingAnimation() {
  // Completely simplified animation with no CSS modules or complex logic
  return (
    <div className="relative" aria-hidden="true">
      <svg 
        width="96" 
        height="96" 
        viewBox="0 0 96 96" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        className="animate-pulse"
      >
        {/* Pot body */}
        <path d="M72 40H24V72C24 75.3137 26.6863 78 30 78H66C69.3137 78 72 75.3137 72 72V40Z" fill="#D1D5DB" />
        {/* Pot rim */}
        <path d="M66 40H30C26.6863 40 24 37.3137 24 34C24 30.6863 26.6863 28 30 28H66C69.3137 28 72 30.6863 72 34C72 37.3137 69.3137 40 66 40Z" fill="#4CAF50" />
        {/* Left handle */}
        <path d="M48 28C48 21.3726 42.6274 16 36 16C29.3726 16 24 21.3726 24 28" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" />
        {/* Right handle */}
        <path d="M48 28C48 21.3726 53.3726 16 60 16C66.6274 16 72 21.3726 72 28" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" />
      </svg>
      
      {/* Simple steam particles with standard Tailwind animations */}
      <div className="absolute -top-2 left-1/4 w-2 h-2 bg-white/80 rounded-full animate-ping opacity-75 delay-75"></div>
      <div className="absolute -top-3 left-1/2 w-2 h-2 bg-white/80 rounded-full animate-ping opacity-75 delay-150"></div>
      <div className="absolute -top-4 left-3/4 w-2 h-2 bg-white/80 rounded-full animate-ping opacity-75 delay-300"></div>
    </div>
  );
}
