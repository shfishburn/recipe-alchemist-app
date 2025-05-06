
import React from 'react';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function NutriScoreTooltip() {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            <InfoIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2">
            <p className="text-sm font-medium">What is NutriScore?</p>
            <p className="text-xs">
              NutriScore is a nutritional rating system that ranks foods from A (healthiest) to E (least healthy)
              based on their nutritional composition.
            </p>
            <p className="text-xs">
              The score is calculated by subtracting "negative points" (for calories, saturated fat, sugars, and sodium)
              from "positive points" (for protein, fiber, and fruit/vegetable content).
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
