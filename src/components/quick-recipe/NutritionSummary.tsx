
import React from 'react';
import { NutritionImpact } from '@/hooks/use-recipe-modifications';

interface NutritionSummaryProps {
  nutrition?: NutritionImpact;
}

export const NutritionSummary: React.FC<NutritionSummaryProps> = ({ nutrition }) => {
  if (!nutrition) return null;

  return (
    <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
      <h3 className="text-sm font-medium mb-2">Potential Nutrition Changes</h3>
      <div className="text-xs space-y-1">
        <ImpactRow label="Calories" value={nutrition.calories} />
        <ImpactRow label="Protein" value={nutrition.protein} unit="g" />
        <ImpactRow label="Carbs" value={nutrition.carbs} unit="g" />
        <ImpactRow label="Fat" value={nutrition.fat} unit="g" />
        {nutrition.summary && (
          <p className="mt-2 text-muted-foreground">{nutrition.summary}</p>
        )}
      </div>
    </div>
  );
}

// Helper component for displaying impact values
function ImpactRow({ label, value, unit = '' }: { label: string; value: number; unit?: string }) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className={`font-medium ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : ''}`}>
        {isPositive && '+'}{Math.round(value)}{unit}
      </span>
    </div>
  );
}
