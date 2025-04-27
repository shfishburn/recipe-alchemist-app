
import React from 'react';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function InfoPanel() {
  return (
    <div className="mt-6 p-4 bg-green-50 rounded-md">
      <div className="flex items-center mb-2">
        <h4 className="font-medium">Why this matters:</h4>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">These details help optimize your nutrition for better health outcomes.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="text-sm text-muted-foreground">
        Complex carbs provide sustained energy and more nutrients, while simple carbs give quick energy. 
        Unsaturated fats are generally healthier than saturated fats. These ratios help optimize your nutrition
        for your specific health goals.
      </p>
    </div>
  );
}
