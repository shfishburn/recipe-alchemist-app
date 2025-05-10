
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SimplifiedNutriScoreProps {
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const GRADE_COLORS = {
  'A': 'bg-green-100 text-green-800 border-green-300',
  'B': 'bg-lime-100 text-lime-800 border-lime-300',
  'C': 'bg-amber-100 text-amber-800 border-amber-300', 
  'D': 'bg-orange-100 text-orange-800 border-orange-300',
  'E': 'bg-red-100 text-red-800 border-red-300',
};

export function SimplifiedNutriScore({ 
  grade, 
  size = 'md',
  showLabel = true, 
  className = '' 
}: SimplifiedNutriScoreProps) {
  const gradeColor = GRADE_COLORS[grade] || 'bg-gray-100 text-gray-800 border-gray-300';
  
  const sizeClasses = {
    'sm': 'text-xs px-1.5 py-0.5',
    'md': 'text-sm px-2 py-1',
    'lg': 'text-base px-3 py-1.5'
  };

  return (
    <Badge 
      variant="outline" 
      className={`font-medium border ${gradeColor} ${sizeClasses[size]} ${className}`}
    >
      {showLabel ? 'Nutri-Score ' : ''}{grade}
    </Badge>
  );
}
