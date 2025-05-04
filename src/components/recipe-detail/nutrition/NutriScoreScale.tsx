
import React from 'react';
import { cn } from '@/lib/utils';

type NutriScoreGrade = 'A' | 'B' | 'C' | 'D' | 'E' | null;

interface NutriScoreScaleProps {
  activeGrade: NutriScoreGrade;
  className?: string;
  showLabels?: boolean;
}

const grades: NutriScoreGrade[] = ['A', 'B', 'C', 'D', 'E'];

const gradeColors = {
  A: 'bg-green-500',
  B: 'bg-light-green-500',
  C: 'bg-yellow-500',
  D: 'bg-orange-500',
  E: 'bg-red-500',
  null: 'bg-gray-300',
};

export function NutriScoreScale({ 
  activeGrade, 
  className,
  showLabels = true
}: NutriScoreScaleProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {showLabels && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Healthier</span>
          <span>Less healthy</span>
        </div>
      )}
      <div className="flex h-8 w-full overflow-hidden rounded-md">
        {grades.map((grade) => (
          <div 
            key={grade}
            className={cn(
              "flex-1 transition-opacity",
              gradeColors[grade],
              activeGrade === grade ? "opacity-100" : "opacity-50"
            )}
            aria-selected={activeGrade === grade}
          >
            <div className="flex h-full items-center justify-center font-medium text-white">
              {grade}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
