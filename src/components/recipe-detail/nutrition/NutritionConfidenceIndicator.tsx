
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { EnhancedNutrition } from '@/types/nutrition-enhanced';

interface NutritionConfidenceIndicatorProps {
  nutrition: EnhancedNutrition;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export function NutritionConfidenceIndicator({ 
  nutrition, 
  size = 'md',
  showTooltip = true 
}: NutritionConfidenceIndicatorProps) {
  if (!nutrition?.data_quality) {
    return null;
  }
  
  const { overall_confidence, overall_confidence_score } = nutrition.data_quality;
  
  const getConfidenceColor = () => {
    switch (overall_confidence) {
      case 'high': return 'bg-green-600 hover:bg-green-700';
      case 'medium': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'low': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'text-xs px-1.5 py-0.5';
      case 'lg': return 'text-sm px-2.5 py-1';
      case 'md':
      default: return 'text-xs px-2 py-0.5';
    }
  };
  
  const formatScore = (score: number) => {
    return Math.round(score * 100) + '%';
  };
  
  const getLimitationText = () => {
    const limitations = [];
    
    if (nutrition.data_quality.penalties.energy_check_fail) {
      limitations.push('Energy validation check failed');
    }
    
    if (nutrition.data_quality.penalties.unmatched_ingredients_rate > 0.2) {
      limitations.push(`${Math.round(nutrition.data_quality.penalties.unmatched_ingredients_rate * 100)}% of ingredients couldn't be matched`);
    }
    
    if (nutrition.data_quality.penalties.low_confidence_top_ingredients) {
      limitations.push('Low confidence in main ingredients');
    }
    
    if (limitations.length === 0) {
      return 'No significant limitations detected';
    }
    
    return limitations.join('. ');
  };
  
  const badge = (
    <Badge className={`${getConfidenceColor()} ${getSizeClasses()} text-white capitalize font-semibold`}>
      {overall_confidence} {formatScore(overall_confidence_score)}
    </Badge>
  );
  
  if (!showTooltip) {
    return badge;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1">
            {badge}
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold">Nutrition Confidence: {formatScore(overall_confidence_score)}</p>
            <p className="text-sm text-muted-foreground">{getLimitationText()}</p>
            {nutrition.data_quality.unmatched_or_low_confidence_ingredients?.length > 0 && (
              <div className="text-xs">
                <p className="font-medium">Ingredients with lower confidence:</p>
                <p className="text-muted-foreground">
                  {nutrition.data_quality.unmatched_or_low_confidence_ingredients.join(', ')}
                </p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
