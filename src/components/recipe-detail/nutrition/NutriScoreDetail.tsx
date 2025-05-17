
import React from 'react';
import type { NutriScore } from '@/types/recipe';

interface NutriScoreDetailProps {
  score: NutriScore;
  positive: NutriScore['positive_points'];
  negative: NutriScore['negative_points'];
}

export function NutriScoreDetail({
  score,
  positive,
  negative
}: NutriScoreDetailProps) {
  // Check if we have valid data
  if (score.score === null || !positive || !negative) {
    return null;
  }
  
  // Calculate percentages for bars
  const maxNegative = 40; // Maximum possible negative points
  const maxPositive = 15; // Maximum possible positive points
  
  const negativePercent = Math.min(100, ((negative.total || 0) / maxNegative) * 100);
  const positivePercent = Math.min(100, ((positive.total || 0) / maxPositive) * 100);

  return (
    <div className="mt-3">
      {/* Score breakdown */}
      <div className="flex justify-between items-center text-xs mb-2">
        <span className="text-gray-600 font-medium">Score breakdown</span>
        <span className="font-medium">{score.score}</span>
      </div>
      
      {/* Score bars */}
      <div className="flex gap-1 items-center">
        {/* Negative points bar */}
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="bg-red-400 h-full rounded-full" 
            style={{ width: `${negativePercent}%` }}
          />
        </div>
        
        <span className="text-xs text-gray-500 w-8 text-center">vs</span>
        
        {/* Positive points bar */}
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="bg-green-400 h-full rounded-full" 
            style={{ width: `${positivePercent}%` }}
          />
        </div>
      </div>
      
      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <div>Negative: {negative.total || 0} pts</div>
        <div>Positive: {positive.total || 0} pts</div>
      </div>
      
      {/* Point breakdown */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3">
        <div>
          <p className="text-xs font-medium text-gray-600">Negative Points</p>
          <ul className="text-xs text-gray-500 space-y-0.5 mt-1">
            {negative.energy !== null && (
              <li className="flex justify-between">
                <span>Energy:</span> <span>{negative.energy} pts</span>
              </li>
            )}
            {negative.sugars !== null && (
              <li className="flex justify-between">
                <span>Sugars:</span> <span>{negative.sugars} pts</span>
              </li>
            )}
            {negative.saturated_fat !== null && (
              <li className="flex justify-between">
                <span>Saturated fat:</span> <span>{negative.saturated_fat} pts</span>
              </li>
            )}
            {negative.sodium !== null && (
              <li className="flex justify-between">
                <span>Sodium:</span> <span>{negative.sodium} pts</span>
              </li>
            )}
          </ul>
        </div>
        
        <div>
          <p className="text-xs font-medium text-gray-600">Positive Points</p>
          <ul className="text-xs text-gray-500 space-y-0.5 mt-1">
            {positive.fruit_veg_nuts !== null && (
              <li className="flex justify-between">
                <span>Fruits/veg/nuts:</span> <span>{positive.fruit_veg_nuts} pts</span>
              </li>
            )}
            {positive.fiber !== null && (
              <li className="flex justify-between">
                <span>Fiber:</span> <span>{positive.fiber} pts</span>
              </li>
            )}
            {positive.protein !== null && (
              <li className="flex justify-between">
                <span>Protein:</span> <span>{positive.protein} pts</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
