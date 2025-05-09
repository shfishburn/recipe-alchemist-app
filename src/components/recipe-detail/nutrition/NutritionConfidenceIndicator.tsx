
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CirclePercent, RefreshCw } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { EnhancedNutrition } from '@/types/nutrition-enhanced';
import { Button } from '@/components/ui/button';

interface NutritionConfidenceIndicatorProps {
  nutrition: EnhancedNutrition;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  onRefresh?: () => void;
}

export function NutritionConfidenceIndicator({ 
  nutrition, 
  size = 'md',
  showTooltip = true,
  onRefresh
}: NutritionConfidenceIndicatorProps) {
  if (!nutrition?.data_quality) {
    return null;
  }
  
  // Default values in case they're missing
  const confidence = nutrition.data_quality?.overall_confidence || 'medium';
  const confidenceScore = nutrition.data_quality?.overall_confidence_score || 0.7;
  
  const getConfidenceColor = () => {
    switch (confidence) {
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
    // Check if score is a valid number and format it
    return !isNaN(score) ? Math.round(score * 100) + '%' : 'N/A';
  };
  
  const getLimitationText = () => {
    const limitations = [];
    // Initialize penalties with empty object if undefined
    const penalties = nutrition.data_quality?.penalties || {};
    
    // Add proper null checks for all properties
    if (penalties && 'energy_check_fail' in penalties && penalties.energy_check_fail) {
      limitations.push('Energy validation check failed');
    }
    
    if (penalties && 'unmatched_ingredients_rate' in penalties && 
        typeof penalties.unmatched_ingredients_rate === 'number' && 
        penalties.unmatched_ingredients_rate > 0.2) {
      limitations.push(`${Math.round(penalties.unmatched_ingredients_rate * 100)}% of ingredients couldn't be matched`);
    }
    
    if (penalties && 'low_confidence_top_ingredients' in penalties && penalties.low_confidence_top_ingredients) {
      limitations.push('Low confidence in main ingredients');
    }
    
    if (limitations.length === 0) {
      return 'No significant limitations detected';
    }
    
    return limitations.join('. ');
  };
  
  const getHowItWorksText = () => {
    return "Our AI analyzes each recipe's ingredients to estimate its nutritional content. The confidence score indicates the reliability of these values based on ingredient data quality.";
  };
  
  const getQualityExplanation = () => {
    switch (confidence) {
      case 'high': 
        return "High confidence means most ingredients were accurately matched to our nutrition database.";
      case 'medium': 
        return "Medium confidence means some ingredients may have been difficult to match precisely to our nutrition database.";
      case 'low': 
        return "Low confidence means many ingredients couldn't be matched accurately, so these values are rough estimates.";
      default:
        return "";
    }
  };

  const getImprovementTips = () => {
    const tips = [
      "Use specific ingredient names (e.g. 'yellow onion' instead of just 'onion')",
      "Include precise quantities and standard units for all ingredients",
      "Avoid abbreviations in ingredient names",
      "Break down complex ingredients into their components"
    ];

    return (
      <div className="mt-2 text-xs border-t pt-2 border-gray-200">
        <p className="font-semibold">To improve confidence score:</p>
        <ul className="list-disc pl-4 mt-1 space-y-1">
          {tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2 text-xs"
            onClick={onRefresh}
          >
            <RefreshCw className="w-3 h-3 mr-1" /> Refresh Nutrition Data
          </Button>
        )}
      </div>
    );
  };
  
  const badge = (
    <Badge className={`${getConfidenceColor()} ${getSizeClasses()} text-white capitalize font-semibold`}>
      {confidence} {formatScore(confidenceScore)}
    </Badge>
  );
  
  if (!showTooltip) {
    return badge;
  }
  
  // Safety check for unmatched_or_low_confidence_ingredients
  const unmatchedIngredients = nutrition.data_quality?.unmatched_or_low_confidence_ingredients || [];
  
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1 cursor-help">
            {badge}
            <CirclePercent className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs p-4 z-50">
          <div className="space-y-2">
            <p className="font-semibold">Nutrition Confidence: {formatScore(confidenceScore)}</p>
            <p className="text-sm">{getQualityExplanation()}</p>
            <p className="text-sm text-muted-foreground">{getHowItWorksText()}</p>
            <p className="text-sm text-muted-foreground">{getLimitationText()}</p>
            {unmatchedIngredients.length > 0 && (
              <div className="text-xs">
                <p className="font-medium">Ingredients with lower confidence:</p>
                <p className="text-muted-foreground">
                  {unmatchedIngredients.join(', ')}
                </p>
              </div>
            )}
            {getImprovementTips()}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
