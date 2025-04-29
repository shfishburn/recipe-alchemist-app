
import React from 'react';
import { ExtendedNutritionData } from './useNutritionData';
import { DAILY_REFERENCE_VALUES } from '@/types/nutrition-utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MicronutrientsDisplayProps {
  nutrition: ExtendedNutritionData;
}

const NUTRIENT_INFO = {
  fiber: {
    name: 'Fiber',
    description: 'Supports digestive health and helps maintain steady blood sugar levels',
    unit: 'g',
    reference: DAILY_REFERENCE_VALUES.fiber
  },
  vitamin_a: {
    name: 'Vitamin A',
    description: 'Important for vision, immune function, and cell growth',
    unit: 'IU',
    reference: DAILY_REFERENCE_VALUES.vitamin_a
  },
  vitamin_c: {
    name: 'Vitamin C',
    description: 'Antioxidant that supports immune function and collagen production',
    unit: 'mg',
    reference: DAILY_REFERENCE_VALUES.vitamin_c
  },
  vitamin_d: {
    name: 'Vitamin D',
    description: 'Essential for calcium absorption and bone health',
    unit: 'IU',
    reference: DAILY_REFERENCE_VALUES.vitamin_d
  },
  calcium: {
    name: 'Calcium',
    description: 'Critical for bone health, muscle function, and nerve signaling',
    unit: 'mg',
    reference: DAILY_REFERENCE_VALUES.calcium
  },
  iron: {
    name: 'Iron',
    description: 'Essential for oxygen transport in the blood and energy metabolism',
    unit: 'mg',
    reference: DAILY_REFERENCE_VALUES.iron
  },
  potassium: {
    name: 'Potassium',
    description: 'Important for heart function, muscle contractions, and fluid balance',
    unit: 'mg',
    reference: DAILY_REFERENCE_VALUES.potassium
  },
  sodium: {
    name: 'Sodium',
    description: 'Essential for fluid balance and nerve/muscle function (limit intake)',
    unit: 'mg',
    reference: DAILY_REFERENCE_VALUES.sodium
  },
  sugar: {
    name: 'Sugar',
    description: 'Natural and added sugars that provide quick energy (limit intake)',
    unit: 'g',
    reference: DAILY_REFERENCE_VALUES.sugar
  }
};

export function MicronutrientsDisplay({ nutrition }: MicronutrientsDisplayProps) {
  const isMobile = useIsMobile();
  
  const getPercentageColor = (percentage: number, isLowerBetter: boolean = false) => {
    if (isLowerBetter) {
      if (percentage <= 10) return "text-green-600";
      if (percentage <= 25) return "text-blue-600";
      if (percentage <= 50) return "text-amber-600";
      return "text-red-600";
    } else {
      if (percentage <= 15) return "text-blue-600";
      if (percentage <= 40) return "text-green-600"; 
      if (percentage <= 75) return "text-amber-600";
      return "text-red-600";
    }
  };
  
  const renderProgressBar = (percentage: number, isLowerBetter: boolean = false) => {
    let bgColor = 'bg-green-500';
    
    if (isLowerBetter) {
      if (percentage > 50) bgColor = 'bg-red-500';
      else if (percentage > 25) bgColor = 'bg-amber-500';
      else bgColor = 'bg-green-500';
    } else {
      if (percentage > 75) bgColor = 'bg-green-500';
      else if (percentage > 40) bgColor = 'bg-amber-500';
      else bgColor = 'bg-blue-500';
    }
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
        <div 
          className={`${bgColor} h-2 rounded-full`} 
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    );
  };
  
  // Display fiber prominently as it's important
  const renderFiberSection = () => (
    <div className="bg-white p-3 rounded-md shadow-sm mb-4" style={{ borderLeft: `3px solid #65a30d` }}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium flex items-center">
            Dietary Fiber
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-3 w-3 ml-1.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">{NUTRIENT_INFO.fiber.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-baseline gap-2">
            <p className="text-lg font-semibold">{nutrition.fiber}g</p>
            <p className={`text-xs font-medium ${getPercentageColor(nutrition.fiberPercentage)}`}>
              {nutrition.fiberPercentage}% DV
            </p>
          </div>
        </div>
      </div>
      {renderProgressBar(nutrition.fiberPercentage)}
      <p className="text-xs text-muted-foreground mt-1">
        Daily goal: {DAILY_REFERENCE_VALUES.fiber}g
      </p>
    </div>
  );

  // Group micronutrients by category
  const vitamins = [
    { key: 'vitamin_a', value: nutrition.vitamin_a, percentage: nutrition.vitamin_a_percentage },
    { key: 'vitamin_c', value: nutrition.vitamin_c, percentage: nutrition.vitamin_c_percentage },
    { key: 'vitamin_d', value: nutrition.vitamin_d, percentage: nutrition.vitamin_d_percentage }
  ];
  
  const minerals = [
    { key: 'calcium', value: nutrition.calcium, percentage: nutrition.calcium_percentage },
    { key: 'iron', value: nutrition.iron, percentage: nutrition.iron_percentage },
    { key: 'potassium', value: nutrition.potassium, percentage: nutrition.potassium_percentage }
  ];
  
  const others = [
    { key: 'sodium', value: nutrition.sodium, percentage: nutrition.sodiumPercentage, isLowerBetter: true },
    { key: 'sugar', value: nutrition.sugar, percentage: nutrition.sugarPercentage, isLowerBetter: true }
  ];

  // Helper to render a nutrient row
  const renderNutrientRow = (nutrient: { key: string, value: number, percentage: number, isLowerBetter?: boolean }) => {
    const info = NUTRIENT_INFO[nutrient.key as keyof typeof NUTRIENT_INFO];
    
    return (
      <div key={nutrient.key} className="py-2 border-b border-gray-100 last:border-none">
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm flex items-center">
            {info.name}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-3 w-3 ml-1.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">{info.description}</p>
                  <p className="text-xs mt-1">Daily value: {info.reference}{info.unit}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-sm font-medium">{nutrient.value}{info.unit}</p>
            <p className={`text-xs ${getPercentageColor(nutrient.percentage, nutrient.isLowerBetter)}`}>
              {nutrient.percentage}% DV
            </p>
          </div>
        </div>
        {renderProgressBar(nutrient.percentage, nutrient.isLowerBetter)}
      </div>
    );
  };

  return (
    <div className="space-y-4 mt-6">
      <h4 className="text-sm font-medium mb-2">Dietary Fiber & Micronutrients</h4>
      
      {/* Fiber section */}
      {renderFiberSection()}
      
      {/* Accordion for categorized micronutrients */}
      <Accordion type="multiple" defaultValue={isMobile ? [] : ['vitamins', 'minerals', 'others']} className="bg-slate-50 rounded-md">
        <AccordionItem value="vitamins" className="border-b px-4">
          <AccordionTrigger className="py-2">
            <span className="text-sm font-medium">Vitamins</span>
          </AccordionTrigger>
          <AccordionContent className="bg-white rounded-md p-3">
            {vitamins.map(renderNutrientRow)}
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="minerals" className="border-b px-4">
          <AccordionTrigger className="py-2">
            <span className="text-sm font-medium">Minerals</span>
          </AccordionTrigger>
          <AccordionContent className="bg-white rounded-md p-3">
            {minerals.map(renderNutrientRow)}
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="others" className="px-4">
          <AccordionTrigger className="py-2">
            <span className="text-sm font-medium">Other Nutrition Info</span>
          </AccordionTrigger>
          <AccordionContent className="bg-white rounded-md p-3">
            {others.map(renderNutrientRow)}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <p className="text-xs text-muted-foreground italic">
        *DV = Daily Value, based on a 2,000 calorie diet. Individual needs may vary.
      </p>
    </div>
  );
}
