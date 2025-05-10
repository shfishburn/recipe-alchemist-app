
import React from 'react';
import { QuickRecipe } from '@/types/quick-recipe';
import { Card } from '@/components/ui/card';
import PieChart from '@/components/common/PieChart';
import { NutritionImpact } from '@/hooks/use-recipe-modifications';

interface QuickRecipeNutritionSummaryProps {
  recipe: QuickRecipe;
  nutritionImpact?: NutritionImpact;
}

export function QuickRecipeNutritionSummary({ recipe, nutritionImpact }: QuickRecipeNutritionSummaryProps) {
  const nutrition = recipe.nutrition || {};
  
  // Calculate total calories
  const totalCalories = nutrition.calories || 0;
  
  // Calculate macros with fallbacks
  const protein = nutrition.protein || 0;
  const carbs = nutrition.carbs || 0;
  const fat = nutrition.fat || 0;
  
  // Calculate percentages for pie chart
  const proteinCals = protein * 4;
  const carbsCals = carbs * 4;
  const fatCals = fat * 9;
  const totalMacroCals = proteinCals + carbsCals + fatCals;
  
  const proteinPct = totalMacroCals > 0 ? (proteinCals / totalMacroCals) * 100 : 0;
  const carbsPct = totalMacroCals > 0 ? (carbsCals / totalMacroCals) * 100 : 0;
  const fatPct = totalMacroCals > 0 ? (fatCals / totalMacroCals) * 100 : 0;
  
  // Prepare data for pie chart
  const chartData = [
    { name: 'Protein', value: proteinPct, color: '#4ade80' },
    { name: 'Carbs', value: carbsPct, color: '#60a5fa' },
    { name: 'Fat', value: fatPct, color: '#f87171' },
  ];
  
  return (
    <div className="space-y-4">
      {/* Macronutrient distribution */}
      <div>
        <h3 className="text-sm font-medium mb-2">Macronutrient Distribution</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square">
            <PieChart data={chartData} />
          </div>
          <div className="grid grid-cols-1 gap-2 content-center">
            <MacroRow label="Protein" value={protein} unit="g" color="#4ade80" percent={proteinPct} />
            <MacroRow label="Carbs" value={carbs} unit="g" color="#60a5fa" percent={carbsPct} />
            <MacroRow label="Fat" value={fat} unit="g" color="#f87171" percent={fatPct} />
          </div>
        </div>
      </div>
      
      {/* Summary */}
      <div>
        <h3 className="text-sm font-medium mb-2">Nutrition Summary</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-muted p-2 rounded flex justify-between">
            <span>Calories</span>
            <span className="font-medium">{Math.round(totalCalories)}</span>
          </div>
          <div className="bg-muted p-2 rounded flex justify-between">
            <span>Protein</span>
            <span className="font-medium">{Math.round(protein)}g</span>
          </div>
          <div className="bg-muted p-2 rounded flex justify-between">
            <span>Carbs</span>
            <span className="font-medium">{Math.round(carbs)}g</span>
          </div>
          <div className="bg-muted p-2 rounded flex justify-between">
            <span>Fat</span>
            <span className="font-medium">{Math.round(fat)}g</span>
          </div>
        </div>
      </div>
      
      {/* Nutrition Impact */}
      {nutritionImpact && (
        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
          <h3 className="text-sm font-medium mb-2">Potential Nutrition Changes</h3>
          <div className="text-xs space-y-1">
            <ImpactRow label="Calories" value={nutritionImpact.calories} />
            <ImpactRow label="Protein" value={nutritionImpact.protein} unit="g" />
            <ImpactRow label="Carbs" value={nutritionImpact.carbs} unit="g" />
            <ImpactRow label="Fat" value={nutritionImpact.fat} unit="g" />
            <p className="mt-2 text-muted-foreground">{nutritionImpact.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for displaying macronutrient rows
function MacroRow({ label, value, unit, color, percent }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
      <div className="flex-1">{label}</div>
      <div className="font-medium">{Math.round(value)}{unit} ({Math.round(percent)}%)</div>
    </div>
  );
}

// Helper component for displaying impact values
function ImpactRow({ label, value, unit = '' }) {
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
