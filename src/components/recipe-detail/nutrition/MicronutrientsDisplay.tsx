
import React from 'react';
import { ExtendedNutritionData } from './useNutritionData';
import { Card, CardContent } from '@/components/ui/card';
import { formatNutrientWithUnit } from '@/components/ui/unit-display';
import { DAILY_REFERENCE_VALUES, NUTRIENT_DESCRIPTIONS, NUTRIENT_DISPLAY_NAMES, NUTRIENT_UNITS } from '@/constants/nutrition';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoCircle } from 'lucide-react';

interface MicronutrientsDisplayProps {
  nutrition: ExtendedNutritionData;
  unitSystem: 'metric' | 'imperial';
}

export function MicronutrientsDisplay({ nutrition, unitSystem }: MicronutrientsDisplayProps) {
  // Calculate the percentage of daily value for each nutrient
  const calculateDailyValuePercentage = (value: number | undefined, nutrient: string): number => {
    if (!value || !DAILY_REFERENCE_VALUES[nutrient as keyof typeof DAILY_REFERENCE_VALUES]) return 0;
    return Math.round((value / DAILY_REFERENCE_VALUES[nutrient as keyof typeof DAILY_REFERENCE_VALUES]) * 100);
  };
  
  // Helper function to get nutrient description
  const getNutrientDescription = (nutrient: string): string => {
    const key = nutrient.toLowerCase().replace(/[^a-z0-9]/g, '') as keyof typeof NUTRIENT_DESCRIPTIONS;
    return NUTRIENT_DESCRIPTIONS[key] || 
           `Essential nutrient for overall health`;
  };
  
  // Group the micronutrients into categories
  const vitamins = [
    {
      name: 'Vitamin A',
      value: nutrition.vitaminA || 0,
      unit: NUTRIENT_UNITS.vitaminA || 'μg RAE',
      percentage: calculateDailyValuePercentage(nutrition.vitaminA, 'vitaminA'),
      description: getNutrientDescription('vitaminA')
    },
    {
      name: 'Vitamin C',
      value: nutrition.vitaminC || 0,
      unit: NUTRIENT_UNITS.vitaminC || 'mg',
      percentage: calculateDailyValuePercentage(nutrition.vitaminC, 'vitaminC'),
      description: getNutrientDescription('vitaminC')
    },
    {
      name: 'Vitamin D',
      value: nutrition.vitaminD || 0,
      unit: NUTRIENT_UNITS.vitaminD || 'μg',
      percentage: calculateDailyValuePercentage(nutrition.vitaminD, 'vitaminD'),
      description: getNutrientDescription('vitaminD')
    },
    {
      name: 'Vitamin E',
      value: nutrition.vitaminE || 0,
      unit: NUTRIENT_UNITS.vitaminE || 'mg',
      percentage: calculateDailyValuePercentage(nutrition.vitaminE, 'vitaminE'),
      description: getNutrientDescription('vitaminE')
    },
    {
      name: 'Vitamin K',
      value: nutrition.vitaminK || 0,
      unit: NUTRIENT_UNITS.vitaminK || 'μg',
      percentage: calculateDailyValuePercentage(nutrition.vitaminK, 'vitaminK'),
      description: getNutrientDescription('vitaminK')
    }
  ].filter(vitamin => vitamin.value > 0); // Only show vitamins with values
  
  const minerals = [
    {
      name: 'Calcium',
      value: nutrition.calcium || 0,
      unit: NUTRIENT_UNITS.calcium || 'mg',
      percentage: calculateDailyValuePercentage(nutrition.calcium, 'calcium'),
      description: getNutrientDescription('calcium')
    },
    {
      name: 'Iron',
      value: nutrition.iron || 0,
      unit: NUTRIENT_UNITS.iron || 'mg',
      percentage: calculateDailyValuePercentage(nutrition.iron, 'iron'),
      description: getNutrientDescription('iron')
    },
    {
      name: 'Potassium',
      value: nutrition.potassium || 0,
      unit: NUTRIENT_UNITS.potassium || 'mg',
      percentage: calculateDailyValuePercentage(nutrition.potassium, 'potassium'),
      description: getNutrientDescription('potassium')
    },
    {
      name: 'Magnesium',
      value: nutrition.magnesium || 0,
      unit: NUTRIENT_UNITS.magnesium || 'mg',
      percentage: calculateDailyValuePercentage(nutrition.magnesium, 'magnesium'),
      description: getNutrientDescription('magnesium')
    },
    {
      name: 'Zinc',
      value: nutrition.zinc || 0,
      unit: NUTRIENT_UNITS.zinc || 'mg',
      percentage: calculateDailyValuePercentage(nutrition.zinc, 'zinc'),
      description: getNutrientDescription('zinc')
    }
  ].filter(mineral => mineral.value > 0); // Only show minerals with values
  
  const others = [
    {
      name: 'Sodium',
      value: nutrition.sodium || 0,
      unit: NUTRIENT_UNITS.sodium || 'mg',
      percentage: calculateDailyValuePercentage(nutrition.sodium, 'sodium'),
      description: getNutrientDescription('sodium')
    },
    {
      name: 'Fiber',
      value: nutrition.fiber || 0,
      unit: NUTRIENT_UNITS.fiber || 'g',
      percentage: calculateDailyValuePercentage(nutrition.fiber, 'fiber'),
      description: getNutrientDescription('fiber')
    },
    {
      name: 'Sugar',
      value: nutrition.sugar || 0,
      unit: NUTRIENT_UNITS.sugar || 'g',
      percentage: calculateDailyValuePercentage(nutrition.sugar, 'sugar'),
      description: getNutrientDescription('sugar')
    }
  ].filter(other => other.value > 0); // Only show nutrients with values
  
  // Helper function to determine the status color based on percentage
  const getStatusColor = (percentage: number) => {
    if (percentage === 0) return 'bg-gray-200';
    if (percentage < 10) return 'bg-red-200';
    if (percentage < 30) return 'bg-yellow-200';
    if (percentage < 60) return 'bg-green-200';
    return 'bg-blue-200';
  };
  
  // Component to display a micronutrient
  const MicronutrientItem = ({ item }: { item: any }) => {
    const formattedValue = formatNutrientWithUnit(item.value, item.unit, unitSystem);
    
    return (
      <div className="mb-2">
        <div className="flex justify-between text-xs mb-1">
          <div className="font-medium flex items-center gap-1">
            {item.name}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">{item.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="text-right">
            {formattedValue} <span className="text-muted-foreground">({item.percentage}% DV)</span>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1">
          <div 
            className={`${getStatusColor(item.percentage)} h-1 rounded-full`} 
            style={{ width: `${Math.min(item.percentage, 100)}%` }}
            aria-hidden="true"
          ></div>
        </div>
      </div>
    );
  };
  
  // Check if we have any micronutrient data to display
  const hasMicronutrients = vitamins.some(v => typeof v.value === 'number' && v.value > 0) || 
                           minerals.some(m => typeof m.value === 'number' && m.value > 0);
  
  if (!hasMicronutrients) return null;
  
  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="text-sm font-medium mb-3">Micronutrients</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vitamins.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold mb-3">Vitamins</h5>
              {vitamins.map((vitamin, idx) => (
                <MicronutrientItem key={idx} item={vitamin} />
              ))}
            </div>
          )}
          
          {minerals.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold mb-3">Minerals</h5>
              {minerals.map((mineral, idx) => (
                <MicronutrientItem key={idx} item={mineral} />
              ))}
            </div>
          )}
          
          {others.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold mb-3">Other Nutrients</h5>
              {others.map((other, idx) => (
                <MicronutrientItem key={idx} item={other} />
              ))}
            </div>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground mt-4 italic">
          DV = Daily Value, based on recommended daily intakes for adults. Your personal needs may vary based on age, gender, and health status.
          {unitSystem === 'imperial' ? ' (US units)' : ' (Metric units)'}
        </p>
      </CardContent>
    </Card>
  );
}
