
import React from 'react';
import { cn } from '@/lib/utils';

type NutriScoreGrade = 'A' | 'B' | 'C' | 'D' | 'E' | null;

interface NutriScoreBadgeProps {
  grade: NutriScoreGrade;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const gradeColors = {
  A: 'bg-green-500',
  B: 'bg-light-green-500',
  C: 'bg-yellow-500',
  D: 'bg-orange-500',
  E: 'bg-red-500',
  null: 'bg-gray-300',
};

const gradeTextColors = {
  A: 'text-white',
  B: 'text-white',
  C: 'text-black',
  D: 'text-white',
  E: 'text-white',
  null: 'text-gray-600',
};

const gradeLabels = {
  A: 'Excellent',
  B: 'Good',
  C: 'Moderate',
  D: 'Poor',
  E: 'Unhealthy',
  null: 'Unknown',
};

const sizesConfig = {
  sm: {
    badge: 'h-6 w-6 text-xs',
    container: 'text-xs',
  },
  md: {
    badge: 'h-9 w-9 text-base',
    container: 'text-sm',
  },
  lg: {
    badge: 'h-12 w-12 text-xl font-bold',
    container: 'text-base',
  },
};

export function NutriScoreBadge({ 
  grade, 
  size = 'md', 
  showLabel = false,
  className
}: NutriScoreBadgeProps) {
  // Default to null if grade is undefined
  const safeGrade = grade || null;
  
  // Don't show anything if there's no valid grade (null grades will show only if explicitly requested)
  if (safeGrade === null && !showLabel) {
    return null;
  }
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div 
        className={cn(
          "flex items-center justify-center rounded-full font-medium",
          gradeColors[safeGrade],
          gradeTextColors[safeGrade],
          sizesConfig[size].badge
        )}
        aria-label={`Nutri-Score ${safeGrade || 'Unknown'}`}
      >
        {safeGrade || '?'}
      </div>
      
      {showLabel && (
        <div className={cn("flex flex-col", sizesConfig[size].container)}>
          <span className="font-medium">Nutri-Score</span>
          <span className="text-muted-foreground">{gradeLabels[safeGrade]}</span>
        </div>
      )}
    </div>
  );
}
