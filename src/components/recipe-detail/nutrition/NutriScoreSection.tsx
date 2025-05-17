
import React from 'react';
import { NutriScoreGrade } from './NutriScoreGrade';
import { NutriScoreDetail } from './NutriScoreDetail';
import type { NutriScore, Recipe } from '@/types/recipe';

interface NutriScoreSectionProps {
  score?: NutriScore;
  recipe?: Recipe;
  compact?: boolean;
  showDetails?: boolean;
}

export function NutriScoreSection({
  score,
  recipe,
  compact = false,
  showDetails = true,
}: NutriScoreSectionProps) {
  // Get score from recipe if provided and not directly passed
  const nutriScore = score || (recipe?.nutri_score || null);
  
  // If no score or grade, show nothing
  if (!nutriScore || !nutriScore.grade) return null;
  
  return (
    <div>
      <div className="flex items-center gap-3">
        <NutriScoreGrade grade={nutriScore.grade} size={compact ? 'md' : 'lg'} />
        
        {!compact && (
          <div className="text-sm">
            <div className="font-medium">Nutri-Score</div>
            <div className="text-gray-500 text-xs">
              Nutrition quality rating
            </div>
          </div>
        )}
      </div>
      
      {showDetails && nutriScore.score !== null && (
        <NutriScoreDetail 
          score={nutriScore}
          positive={nutriScore.positive_points}
          negative={nutriScore.negative_points}
        />
      )}
    </div>
  );
}
