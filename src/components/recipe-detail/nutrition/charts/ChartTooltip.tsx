
import React from 'react';
import { NUTRITION_COLORS, NUTRIENT_INFO } from '../blocks/personal/constants';

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  showPercentage?: boolean;
  unitSystem?: 'metric' | 'imperial';
}

export const ChartTooltip = ({ 
  active, 
  payload, 
  label, 
  showPercentage = false,
  unitSystem = 'metric'
}: ChartTooltipProps) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;
  const nutrientName = data.name;
  const recipeValue = data.Recipe;
  const targetValue = data.Target;
  const percentage = data.percentage;

  const nutrientColor = NUTRITION_COLORS[nutrientName.toLowerCase() as keyof typeof NUTRITION_COLORS] || '#64748b';
  const nutrientInfo = NUTRIENT_INFO[nutrientName.toLowerCase() as keyof typeof NUTRIENT_INFO];

  // Determine unit label based on nutrient type and unit system
  let unitLabel = 'g';
  
  // Check if this is a micronutrient that uses mg or µg
  if (nutrientInfo && 'unit' in nutrientInfo) {
    unitLabel = nutrientInfo.unit;
  } else if (unitSystem === 'imperial' && 
            ['protein', 'carbs', 'fat'].includes(nutrientName.toLowerCase())) {
    // For macronutrients in imperial, we could potentially convert to oz, but
    // nutritional values are typically still shown in grams even in imperial systems
    unitLabel = 'g';
  }

  return (
    <div className="bg-white p-3 border border-gray-200 rounded-md shadow-lg">
      <h4 className="font-medium text-sm mb-1" style={{ color: nutrientColor }}>{nutrientName}</h4>
      
      {nutrientInfo?.description && (
        <p className="text-xs text-gray-500 mb-2">{nutrientInfo.description}</p>
      )}
      
      <div className="text-xs space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-600">Recipe:</span>
          <span className="font-medium">{recipeValue}{unitLabel}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Daily Target:</span>
          <span className="font-medium">{targetValue}{unitLabel}</span>
        </div>
        
        <div className="flex justify-between border-t pt-1 mt-1 border-gray-100">
          <span className="text-gray-600">% of Daily Target:</span>
          <span className={`font-medium ${
            percentage < 25 ? 'text-blue-600' : 
            percentage < 75 ? 'text-green-600' : 
            percentage < 125 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {percentage}%
          </span>
        </div>
        
        {nutrientInfo && ('caloriesPerGram' in nutrientInfo) && (
          <div className="flex justify-between text-gray-500 text-[10px] italic">
            <span>Calories per gram:</span>
            <span>{nutrientInfo.caloriesPerGram} kcal</span>
          </div>
        )}
      </div>
    </div>
  );
};
