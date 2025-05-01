
import React from 'react';
import { ExtendedNutritionData } from './useNutritionData';
import { Card, CardContent } from '@/components/ui/card';

interface MicronutrientsDisplayProps {
  nutrition: ExtendedNutritionData;
  unitSystem: 'metric' | 'imperial';
}

export function MicronutrientsDisplay({ nutrition, unitSystem }: MicronutrientsDisplayProps) {
  // Group the micronutrients into categories
  const vitamins = [
    {
      name: 'Vitamin A',
      value: nutrition.vitamin_a || 0,
      unit: 'IU',
      percentage: nutrition.vitamin_a_percentage || 0,
      description: 'Important for vision and immune function'
    },
    {
      name: 'Vitamin C',
      value: nutrition.vitamin_c || 0,
      unit: 'mg',
      percentage: nutrition.vitamin_c_percentage || 0,
      description: 'Helps with immune function and iron absorption'
    },
    {
      name: 'Vitamin D',
      value: nutrition.vitamin_d || 0,
      unit: 'IU',
      percentage: nutrition.vitamin_d_percentage || 0,
      description: 'Essential for bone health and immune function'
    }
  ];
  
  const minerals = [
    {
      name: 'Calcium',
      value: nutrition.calcium || 0,
      unit: 'mg',
      percentage: nutrition.calcium_percentage || 0,
      description: 'Essential for bone health and muscle function'
    },
    {
      name: 'Iron',
      value: nutrition.iron || 0,
      unit: 'mg',
      percentage: nutrition.iron_percentage || 0,
      description: 'Needed for oxygen transport in blood'
    },
    {
      name: 'Potassium',
      value: nutrition.potassium || 0,
      unit: 'mg',
      percentage: nutrition.potassium_percentage || 0,
      description: 'Helps regulate fluid balance and nerve signals'
    }
  ];
  
  const others = [
    {
      name: 'Sodium',
      value: nutrition.sodium || 0,
      unit: 'mg',
      percentage: nutrition.sodiumPercentage || 0,
      description: 'Important for fluid balance, but limit intake'
    },
    {
      name: 'Fiber',
      value: nutrition.fiber || 0,
      unit: 'g',
      percentage: nutrition.fiberPercentage || 0,
      description: 'Aids in digestion and helps you feel full'
    },
    {
      name: 'Sugar',
      value: nutrition.sugar || 0,
      unit: 'g',
      percentage: nutrition.sugarPercentage || 0,
      description: 'Naturally occurring or added sweeteners'
    }
  ];
  
  // Helper function to determine the status color
  const getStatusColor = (percentage: number) => {
    if (percentage < 10) return 'bg-gray-200';
    if (percentage < 30) return 'bg-red-200';
    if (percentage < 60) return 'bg-yellow-200';
    if (percentage < 100) return 'bg-green-200';
    return 'bg-blue-200';
  };
  
  // Component to display a micronutrient
  const MicronutrientItem = ({ item }: { item: any }) => {
    const displayValue = typeof item.value === 'number' ? item.value.toFixed(1) : '0.0';
    return (
      <div className="mb-2">
        <div className="flex justify-between text-xs mb-1">
          <div className="font-medium">{item.name}</div>
          <div className="text-right">
            {displayValue} {item.unit} <span className="text-muted-foreground">({item.percentage}% DV)</span>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1">
          <div 
            className={`${getStatusColor(item.percentage)} h-1 rounded-full`} 
            style={{ width: `${Math.min(item.percentage, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
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
          <div>
            <h5 className="text-xs font-semibold mb-3">Vitamins</h5>
            {vitamins.map((vitamin, idx) => (
              <MicronutrientItem key={idx} item={vitamin} />
            ))}
          </div>
          
          <div>
            <h5 className="text-xs font-semibold mb-3">Minerals</h5>
            {minerals.map((mineral, idx) => (
              <MicronutrientItem key={idx} item={mineral} />
            ))}
          </div>
          
          <div>
            <h5 className="text-xs font-semibold mb-3">Other Nutrients</h5>
            {others.map((other, idx) => (
              <MicronutrientItem key={idx} item={other} />
            ))}
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-4 italic">
          DV = Daily Value, based on a 2,000 calorie diet. Your personal needs may vary.
          {unitSystem === 'imperial' ? ' (US units)' : ' (Metric units)'}
        </p>
      </CardContent>
    </Card>
  );
}
