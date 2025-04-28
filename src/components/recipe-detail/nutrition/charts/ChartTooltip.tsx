
import React from 'react';
import { TooltipProps } from 'recharts';
import { 
  NameType, 
  ValueType 
} from 'recharts/types/component/DefaultTooltipContent';
import { NUTRIENT_INFO } from '../blocks/personal/constants';

export interface ChartTooltipProps extends TooltipProps<ValueType, NameType> {
  showPercentage?: boolean;
}

export function ChartTooltip({ active, payload, showPercentage = false }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  // Safely access payload data to prevent undefined errors
  const data = payload[0]?.payload;
  if (!data) {
    return null;
  }

  const value = payload[0].value;
  const name = data.name;
  
  if (!name) {
    return null;
  }
  
  // Determine which color to use for the tooltip header
  const headerColor = data.fill || '#333';
  
  // Find nutrient info from our constants
  const getNutrientInfo = (name: string) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('protein')) return NUTRIENT_INFO.protein;
    if (lowercaseName.includes('carb')) return NUTRIENT_INFO.carbs;
    if (lowercaseName.includes('fat')) return NUTRIENT_INFO.fat;
    if (lowercaseName.includes('calorie')) return NUTRIENT_INFO.calories;
    return null;
  };
  
  const nutrientInfo = getNutrientInfo(name);
  
  return (
    <div className="bg-white p-3 border rounded-md shadow-md text-xs">
      <p className="font-medium mb-1 text-sm" style={{ color: headerColor }}>{name}</p>
      
      {showPercentage ? (
        <>
          <p className="mb-0.5">
            <span className="font-semibold">{value}%</span> of daily target
          </p>
          <p className="text-muted-foreground">
            {data.Recipe}{name === 'Calories' ? ' kcal' : 'g'} of {data.Target}{name === 'Calories' ? ' kcal' : 'g'} target
          </p>
        </>
      ) : (
        <>
          {payload.map((entry, index) => (
            <p key={index} className="mb-0.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5" 
                style={{ backgroundColor: entry.color || '#333', verticalAlign: 'middle' }}></span>
              <span className="font-semibold">{entry.name}: </span>
              <span>{entry.value} {name === 'Calories' ? 'kcal' : 'g'}</span>
            </p>
          ))}
          
          {data.percentage !== undefined && (
            <p className="text-muted-foreground mt-1">
              Recipe provides {data.percentage}% of daily target
            </p>
          )}
        </>
      )}
      
      {/* Additional informational content for each nutrient */}
      {nutrientInfo && (
        <>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-gray-500">{nutrientInfo.description}</p>
            {nutrientInfo.energyPerGram && (
              <p className="text-gray-500 mt-1">
                Provides {nutrientInfo.energyPerGram} calories per gram
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
