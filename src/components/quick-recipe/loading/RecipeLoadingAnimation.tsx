
import React from 'react';
import '@/styles/loading.css';

export function RecipeLoadingAnimation() {
  return (
    <div className="animate-cooking-pot" aria-hidden="true">
      <svg 
        width="96" 
        height="96" 
        viewBox="0 0 96 96" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
      >
        <path d="M72 40H24V72C24 75.3137 26.6863 78 30 78H66C69.3137 78 72 75.3137 72 72V40Z" fill="#D1D5DB" />
        <path d="M66 40H30C26.6863 40 24 37.3137 24 34C24 30.6863 26.6863 28 30 28H66C69.3137 28 72 30.6863 72 34C72 37.3137 69.3137 40 66 40Z" fill="#4CAF50" />
        <path d="M48 28C48 21.3726 53.3726 16 60 16C66.6274 16 72 21.3726 72 28" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" />
        <path d="M48 28C48 21.3726 42.6274 16 36 16C29.3726 16 24 21.3726 24 28" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" />
        <path d="M42 54L54 66" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M54 54L42 66" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
      
      {/* Steam particles with CSS classes instead of inline styles */}
      <div className="steam steam-1"></div>
      <div className="steam steam-2"></div>
      <div className="steam steam-3"></div>
    </div>
  );
}
