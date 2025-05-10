
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SimplifiedNutriScore } from '@/components/landing/nutrition/SimplifiedNutriScore';
import { NutritionImpact } from '@/hooks/use-recipe-modifications';
import { QuickRecipe } from '@/types/quick-recipe';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface QuickRecipeNutritionSummaryProps {
  recipe: QuickRecipe;
  nutritionImpact?: NutritionImpact;
  className?: string;
  compact?: boolean;
}

export function QuickRecipeNutritionSummary({ 
  recipe,
  nutritionImpact,
  className = '',
  compact = false
}: QuickRecipeNutritionSummaryProps) {
  // Fix for nutrition data - provide fallback defaults if any values are missing
  const nutrition = recipe.nutrition || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  };

  // Ensure we have valid numbers for calculations
  const calories = nutrition.calories || nutrition.kcal || 0;
  const protein = nutrition.protein || 0;
  const carbs = nutrition.carbs || 0;
  const fat = nutrition.fat || 0;
  const fiber = nutrition.fiber || 0;

  // Calculate percentages for the macro breakdown with safety checks
  const totalMacros = protein + carbs + fat;
  const proteinPercentage = totalMacros > 0 ? Math.round(protein / totalMacros * 100) : 0;
  const carbsPercentage = totalMacros > 0 ? Math.round(carbs / totalMacros * 100) : 0;
  const fatPercentage = totalMacros > 0 ? Math.round(fat / totalMacros * 100) : 0;

  // Format numbers for display with improved handling
  const formatNumber = (num: number | undefined) => {
    if (num === undefined || isNaN(num)) return '0';
    return Math.round(num).toString();
  };

  // Determine nutri score grade or default to 'C'
  const nutriScoreGrade = recipe.nutrition?.grade || 'C';

  // Impact indicators
  const renderImpactIndicator = (value: number | undefined) => {
    if (!value || Math.abs(value) < 0.1) return <Minus className="h-3 w-3" />;
    return value > 0 
      ? <ArrowUp className="h-3 w-3 text-red-500" /> 
      : <ArrowDown className="h-3 w-3 text-green-500" />;
  };

  return (
    <Card className={`border shadow-sm ${className}`}>
      <CardHeader className={`pb-2 ${compact ? 'px-3 py-2' : ''}`}>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Nutrition Summary</span>
          <SimplifiedNutriScore 
            grade={nutriScoreGrade as 'A' | 'B' | 'C' | 'D' | 'E'} 
            size={compact ? 'sm' : 'md'}
          />
        </CardTitle>
      </CardHeader>

      <CardContent className={compact ? 'px-3 pb-3' : ''}>
        {/* Calories */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <span className="font-medium">Calories</span>
            {nutritionImpact && renderImpactIndicator(nutritionImpact.calories)}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold">
              {formatNumber(calories)}
            </span>
            {nutritionImpact && nutritionImpact.calories !== 0 && (
              <Badge 
                variant={nutritionImpact.calories > 0 ? "destructive" : "outline"}
                className={nutritionImpact.calories > 0 ? "" : "text-green-600 border-green-200 bg-green-50"}
              >
                {nutritionImpact.calories > 0 ? '+' : ''}
                {formatNumber(nutritionImpact.calories)}
              </Badge>
            )}
          </div>
        </div>

        <Separator className="my-2" />

        {/* Macro breakdown */}
        <div className="space-y-2">
          {/* Protein */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span>Protein</span>
              {nutritionImpact && renderImpactIndicator(nutritionImpact.protein)}
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">{formatNumber(protein)}g</span>
              <span className="text-xs text-muted-foreground">({proteinPercentage}%)</span>
              {nutritionImpact && nutritionImpact.protein !== 0 && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    nutritionImpact.protein > 0 
                      ? "text-blue-600 border-blue-200 bg-blue-50" 
                      : "text-gray-600"
                  }`}
                >
                  {nutritionImpact.protein > 0 ? '+' : ''}
                  {formatNumber(nutritionImpact.protein)}g
                </Badge>
              )}
            </div>
          </div>

          {/* Carbs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span>Carbs</span>
              {nutritionImpact && renderImpactIndicator(nutritionImpact.carbs)}
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">{formatNumber(carbs)}g</span>
              <span className="text-xs text-muted-foreground">({carbsPercentage}%)</span>
              {nutritionImpact && nutritionImpact.carbs !== 0 && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    nutritionImpact.carbs > 0 
                      ? "text-amber-600 border-amber-200 bg-amber-50" 
                      : "text-gray-600"
                  }`}
                >
                  {nutritionImpact.carbs > 0 ? '+' : ''}
                  {formatNumber(nutritionImpact.carbs)}g
                </Badge>
              )}
            </div>
          </div>

          {/* Fat */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span>Fat</span>
              {nutritionImpact && renderImpactIndicator(nutritionImpact.fat)}
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">{formatNumber(fat)}g</span>
              <span className="text-xs text-muted-foreground">({fatPercentage}%)</span>
              {nutritionImpact && nutritionImpact.fat !== 0 && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    nutritionImpact.fat > 0 
                      ? "text-yellow-600 border-yellow-200 bg-yellow-50" 
                      : "text-gray-600"
                  }`}
                >
                  {nutritionImpact.fat > 0 ? '+' : ''}
                  {formatNumber(nutritionImpact.fat)}g
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Nutrition impact summary if provided */}
        {nutritionImpact?.summary && (
          <div className="mt-3 pt-2 border-t text-sm text-muted-foreground">
            <p>{nutritionImpact.summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
