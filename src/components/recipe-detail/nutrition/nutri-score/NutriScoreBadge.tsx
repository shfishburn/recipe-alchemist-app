
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { NutriScore } from '@/types/recipe';
import { cn } from '@/lib/utils';

const gradeColors = {
  A: 'bg-green-100 text-green-700 border-green-300',
  B: 'bg-lime-100 text-lime-700 border-lime-300',
  C: 'bg-amber-100 text-amber-700 border-amber-300',
  D: 'bg-orange-100 text-orange-700 border-orange-300',
  E: 'bg-red-100 text-red-700 border-red-300',
};

interface NutriScoreBadgeProps {
  nutriScore: NutriScore | undefined;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

export function NutriScoreBadge({ 
  nutriScore, 
  size = 'md',
  showTooltip = true,
  className
}: NutriScoreBadgeProps) {
  if (!nutriScore) return null;
  
  const { grade } = nutriScore;
  
  const sizeClasses = {
    sm: 'text-xs h-5 w-5 font-semibold',
    md: 'text-sm h-6 w-6 font-semibold',
    lg: 'text-base h-8 w-8 font-bold',
  };
  
  const badgeContent = (
    <div 
      className={cn(
        'flex items-center justify-center rounded-full border',
        gradeColors[grade],
        sizeClasses[size],
        className
      )}
    >
      {grade}
    </div>
  );
  
  if (!showTooltip) {
    return badgeContent;
  }
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {badgeContent}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-sm">
            NutriScore {grade} - {getGradeDescription(grade)}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function getGradeDescription(grade: string): string {
  switch (grade) {
    case 'A':
      return 'Excellent nutritional quality';
    case 'B':
      return 'Good nutritional quality';
    case 'C':
      return 'Average nutritional quality';
    case 'D':
      return 'Poor nutritional quality';
    case 'E':
      return 'Very poor nutritional quality';
    default:
      return 'Unknown nutritional quality';
  }
}
