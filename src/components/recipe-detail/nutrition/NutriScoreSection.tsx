
import React from 'react';
import { NutriScoreGrade } from './NutriScoreGrade';
import { NutriScoreDetail } from './NutriScoreDetail';
import type { NutriScore } from '@/types/recipe';

interface NutriScoreSectionProps {
  score: NutriScore;
  compact?: boolean;
  showDetails?: boolean;
}

export function NutriScoreSection({
  score,
  compact = false,
  showDetails = true,
}: NutriScoreSectionProps) {
  // If no score or grade, show nothing
  if (!score || !score.grade) return null;
  
  return (
    <div>
      <div className="flex items-center gap-3">
        <NutriScoreGrade grade={score.grade} size={compact ? 'md' : 'lg'} />
        
        {!compact && (
          <div className="text-sm">
            <div className="font-medium">Nutri-Score</div>
            <div className="text-gray-500 text-xs">
              Nutrition quality rating
            </div>
          </div>
        )}
      </div>
      
      {showDetails && score.score !== null && (
        <NutriScoreDetail 
          score={score}
          positive={score.positive_points}
          negative={score.negative_points}
        />
      )}
    </div>
  );
}
