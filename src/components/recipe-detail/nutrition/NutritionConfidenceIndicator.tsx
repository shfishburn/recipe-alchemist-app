
import React from 'react';
import { InfoIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DataQuality {
  overall_confidence: string;
  ingredient_coverage: number;
  source_count: number;
  unmatched_or_low_confidence_ingredients?: string[];
  penalties?: {
    [key: string]: number;
  };
}

interface NutritionConfidenceIndicatorProps {
  dataQuality: DataQuality;
  compact?: boolean;
}

export function NutritionConfidenceIndicator({
  dataQuality,
  compact = false,
}: NutritionConfidenceIndicatorProps) {
  // Map confidence level to UI elements
  const getConfidenceDetails = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case 'high':
        return {
          color: 'bg-green-500',
          level: 'High',
          description: 'Nutrition data is highly reliable',
        };
      case 'medium':
        return {
          color: 'bg-amber-500',
          level: 'Medium',
          description: 'Nutrition data is mostly reliable',
        };
      case 'low':
      default:
        return {
          color: 'bg-red-500',
          level: 'Low',
          description: 'Nutrition data is approximate',
        };
    }
  };

  const confidenceDetails = getConfidenceDetails(dataQuality.overall_confidence);

  // Format ingredient coverage as percentage
  const coveragePercent = `${Math.round(dataQuality.ingredient_coverage * 100)}%`;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div
            className={`flex ${
              compact ? 'items-center' : 'items-start'
            } gap-1.5 cursor-help`}
          >
            <div
              className={`${confidenceDetails.color} rounded-full ${
                compact ? 'w-2 h-2' : 'w-3 h-3'
              }`}
            />
            {!compact && (
              <span className="text-xs text-gray-500">
                {confidenceDetails.level} confidence
              </span>
            )}
            {compact && <InfoIcon className="w-3.5 h-3.5 text-gray-400" />}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm p-4">
          <div className="space-y-2">
            <div className="font-medium">{confidenceDetails.level} Confidence Nutrition Data</div>
            <p className="text-sm text-gray-500">{confidenceDetails.description}</p>
            
            <div className="pt-2">
              <div className="text-xs text-gray-500 flex justify-between">
                <span>Ingredient coverage:</span>
                <span className="font-medium">{coveragePercent}</span>
              </div>
              <div className="text-xs text-gray-500 flex justify-between">
                <span>Data sources used:</span>
                <span className="font-medium">{dataQuality.source_count}</span>
              </div>
              
              {/* Only show penalties if they exist - removed for now to fix build errors */}
              {/* {dataQuality.penalties && Object.keys(dataQuality.penalties).length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="text-xs font-medium text-gray-600">Confidence Factors</div>
                  <ul className="mt-1">
                    {Object.entries(dataQuality.penalties).map(([factor, value]) => (
                      <li key={factor} className="text-xs text-gray-500 flex justify-between">
                        <span>{factor.replace(/_/g, ' ')}:</span>
                        <span>{value > 0 ? '-' : '+'}{Math.abs(value)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}
              
              {/* Only show unmatched ingredients if they exist - removed for now to fix build errors */}
              {/* {dataQuality.unmatched_or_low_confidence_ingredients && 
                 dataQuality.unmatched_or_low_confidence_ingredients.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="text-xs font-medium text-gray-600">Low Confidence Ingredients</div>
                  <ul className="mt-1 list-disc list-inside">
                    {dataQuality.unmatched_or_low_confidence_ingredients.slice(0, 3).map((ing, i) => (
                      <li key={i} className="text-xs text-gray-500">{ing}</li>
                    ))}
                    {dataQuality.unmatched_or_low_confidence_ingredients.length > 3 && (
                      <li className="text-xs text-gray-500">
                        +{dataQuality.unmatched_or_low_confidence_ingredients.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>
              )} */}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
