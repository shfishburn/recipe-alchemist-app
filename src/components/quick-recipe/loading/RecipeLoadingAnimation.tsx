
import React from 'react';

export function RecipeLoadingAnimation() {
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
        style={{ animation: 'simple-cooking-pot 2s ease-in-out infinite' }}
      >
        {/* Pot body */}
        <path d="M72 40H24V72C24 75.3137 26.6863 78 30 78H66C69.3137 78 72 75.3137 72 72V40Z" fill="#D1D5DB" />
        {/* Pot rim */}
        <path d="M66 40H30C26.6863 40 24 37.3137 24 34C24 30.6863 26.6863 28 30 28H66C69.3137 28 72 30.6863 72 34C72 37.3137 69.3137 40 66 40Z" fill="#4CAF50" />
        {/* Left handle */}
        <path d="M48 28C48 21.3726 42.6274 16 36 16C29.3726 16 24 21.3726 24 28" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" />
        {/* Right handle */}
        <path d="M48 28C48 21.3726 53.3726 16 60 16C66.6274 16 72 21.3726 72 28" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" />
        {/* X in pot */}
        <path d="M42 54L54 66" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M54 54L42 66" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
      
      {/* Simple steam particles with inline styles */}
      <div 
        className="steam-particle" 
        style={{
          position: 'absolute',
          top: '-5px',
          left: '5px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.8)',
          filter: 'blur(3px)',
          animation: 'simple-steam 2s ease-in-out 0.2s infinite'
        }}
      />
      <div 
        className="steam-particle" 
        style={{
          position: 'absolute',
          top: '-5px',
          left: '15px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.8)',
          filter: 'blur(3px)',
          animation: 'simple-steam 2s ease-in-out 0.6s infinite'
        }}
      />
      <div 
        className="steam-particle" 
        style={{
          position: 'absolute',
          top: '-5px',
          left: '25px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.8)',
          filter: 'blur(3px)',
          animation: 'simple-steam 2s ease-in-out 1.2s infinite'
        }}
      />
      
      <style jsx>{`
        @keyframes simple-cooking-pot {
          0% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-1deg); }
          50% { transform: translateY(-6px) rotate(0deg); }
          75% { transform: translateY(-3px) rotate(1deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        
        @keyframes simple-steam {
          0% { opacity: 0; transform: translateY(0) translateX(0) scale(0.5); }
          50% { opacity: 0.8; transform: translateY(-10px) translateX(3px) scale(0.9); }
          100% { opacity: 0; transform: translateY(-15px) translateX(6px) scale(1.2); }
        }
      `}</style>
    </div>
  );
}
