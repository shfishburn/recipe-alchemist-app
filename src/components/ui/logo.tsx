
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  colorMode?: 'light' | 'dark';
  asLink?: boolean;
}

/**
 * Logo component with Material Design styling
 */
export function Logo({
  className,
  size = 'md',
  withText = true,
  colorMode = 'light',
  asLink = true
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };
  
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };
  
  const logoContent = (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className={cn(
        "rounded-lg overflow-hidden",
        sizeClasses[size]
      )}>
        <img 
          src="/lovable-uploads/recipe-alchemy-logo.png" 
          alt="Recipe Alchemy" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {withText && (
        <span className={cn(
          "font-medium tracking-tight",
          textSizeClasses[size],
          colorMode === 'dark' ? 'text-white' : 'text-gray-800'
        )}>
          Recipe Alchemy
        </span>
      )}
    </div>
  );
  
  return asLink ? (
    <Link to="/" className="hover:opacity-90 transition-opacity">
      {logoContent}
    </Link>
  ) : logoContent;
}
