
import React from 'react';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

interface NutritionSummaryTextProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  caloriesPercentage: number;
  proteinPercentage: number;
  carbsPercentage: number;
  fatPercentage: number;
}

export function NutritionSummaryText({
  calories,
  protein,
  carbs,
  fat,
  caloriesPercentage,
  proteinPercentage,
  carbsPercentage,
  fatPercentage,
}: NutritionSummaryTextProps) {
  const isMobile = useIsMobile();
  
  const getPercentageColor = (percentage: number) => {
    if (percentage <= 15) return "text-blue-600";
    if (percentage <= 40) return "text-green-600"; 
    if (percentage <= 75) return "text-amber-600";
    return "text-red-600";
  };
  
  return (
    <div className="text-sm space-y-2 bg-slate-50 p-4 rounded-md">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-medium">Nutrition Summary</h4>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">Percentages show how much of your daily recommended intake this recipe provides.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="space-y-1 divide-y divide-gray-100">
        <p className="flex justify-between py-1">
          <span className="font-medium">Calories:</span> 
          <span>
            {calories} kcal 
            <span className={`ml-2 font-medium ${getPercentageColor(caloriesPercentage)}`}>
              ({caloriesPercentage}% of daily target)
            </span>
          </span>
        </p>
        
        <p className="flex justify-between py-1">
          <span className="font-medium">Protein:</span> 
          <span>
            {protein}g 
            <span className={`ml-2 font-medium ${getPercentageColor(proteinPercentage)}`}>
              ({proteinPercentage}% of daily target)
            </span>
          </span>
        </p>
        
        <p className="flex justify-between py-1">
          <span className="font-medium">Carbs:</span>
          <span>
            {carbs}g 
            <span className={`ml-2 font-medium ${getPercentageColor(carbsPercentage)}`}>
              ({carbsPercentage}% of daily target)
            </span>
          </span>
        </p>
        
        <p className="flex justify-between py-1">
          <span className="font-medium">Fat:</span>
          <span>
            {fat}g 
            <span className={`ml-2 font-medium ${getPercentageColor(fatPercentage)}`}>
              ({fatPercentage}% of daily target)
            </span>
          </span>
        </p>
      </div>
      
      <div className={`text-xs text-muted-foreground mt-2 ${isMobile ? "pb-8" : "pb-2"}`}>
        <p>
          {caloriesPercentage <= 25 ? 
            "This recipe is a light option that leaves room for other meals in your day." :
            caloriesPercentage <= 40 ? 
            "This recipe provides a moderate portion of your daily caloric needs." :
            "This recipe provides a significant portion of your daily caloric needs."}
        </p>
        <p className="mt-2 pt-1 border-t border-gray-100 font-medium text-slate-600">
          *Protein and carbs provide 4 calories per gram, while fat provides 9 calories per gram.
        </p>
      </div>
    </div>
  );
}
