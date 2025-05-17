
import React from 'react';
import { cn } from "@/lib/utils";

type NutriScoreGradeProps = {
  grade: string | null;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
};

const gradeColors = {
  A: 'bg-green-500',
  B: 'bg-lime-500',
  C: 'bg-yellow-500',
  D: 'bg-orange-500',
  E: 'bg-red-500',
  null: 'bg-gray-300',
  undefined: 'bg-gray-300',
};

export function NutriScoreGrade({ 
  grade, 
  size = 'md',
  showLabel = false 
}: NutriScoreGradeProps) {
  const validGrade = grade && ['A', 'B', 'C', 'D', 'E'].includes(grade) ? grade : null;
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  };
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className={cn(
          "rounded-full flex items-center justify-center font-bold text-white",
          validGrade ? gradeColors[validGrade] : 'bg-gray-300',
          sizeClasses[size]
        )}
      >
        {validGrade || '?'}
      </div>
      {showLabel && (
        <div className="text-xs mt-1 text-center">
          Nutri-Score
        </div>
      )}
    </div>
  );
}
