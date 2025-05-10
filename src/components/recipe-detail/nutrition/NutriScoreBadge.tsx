
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import type { NutriScore } from '@/types/recipe';

const GRADE_COLORS = {
  'A': 'bg-green-100 text-green-800 border-green-300',
  'B': 'bg-lime-100 text-lime-800 border-lime-300',
  'C': 'bg-amber-100 text-amber-800 border-amber-300', 
  'D': 'bg-orange-100 text-orange-800 border-orange-300',
  'E': 'bg-red-100 text-red-800 border-red-300',
};

interface NutriScoreBadgeProps {
  nutriScore?: NutriScore | null;
  grade?: 'A' | 'B' | 'C' | 'D' | 'E'; // Added grade as direct prop option
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

export function NutriScoreBadge({ 
  nutriScore, 
  grade: directGrade,
  size = 'md', 
  showTooltip = true,
  className = '' 
}: NutriScoreBadgeProps) {
  // Use directly provided grade or extract from nutriScore
  const grade = directGrade || (nutriScore?.grade as 'A' | 'B' | 'C' | 'D' | 'E' | undefined);
  
  // If no valid nutri-score is provided, don't render anything
  if (!grade || !['A', 'B', 'C', 'D', 'E'].includes(grade)) {
    return null;
  }
  
  const gradeColor = GRADE_COLORS[grade as keyof typeof GRADE_COLORS] || 'bg-gray-100 text-gray-800 border-gray-300';
  
  const sizeClasses = {
    'sm': 'text-xs px-1.5 py-0.5',
    'md': 'text-sm px-2 py-1',
    'lg': 'text-base px-3 py-1.5'
  };
  
  const badgeContent = (
    <Badge 
      variant="outline" 
      className={`font-medium border ${gradeColor} ${sizeClasses[size]} ${className}`}
    >
      Nutri-Score {grade}
    </Badge>
  );

  if (!showTooltip) {
    return badgeContent;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeContent}
        </TooltipTrigger>
        <TooltipContent>
          <div className="p-1 max-w-xs">
            <p className="font-medium mb-1">Nutri-Score {grade}</p>
            <p className="text-xs text-muted-foreground">
              Nutri-Score rates foods from A (most nutritious) to E (least nutritious) 
              based on nutrients and ingredients.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
