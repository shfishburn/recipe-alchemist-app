import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NutritionImpact } from '@/hooks/recipe-modifications/types';

interface QuickRecipeNutritionSummaryProps {
  nutritionImpact?: NutritionImpact | null;
  className?: string;
  expandedView?: boolean;
}

export function QuickRecipeNutritionSummary({
  nutritionImpact,
  className,
  expandedView = false,
}: QuickRecipeNutritionSummaryProps) {
  if (!nutritionImpact) {
    return (
      <Card className={className}>
        <CardContent>
          <p>No nutrition information available.</p>
        </CardContent>
      </Card>
    );
  }
  
  const renderNutritionItem = (label: string, value: number | undefined, unit: string = '') => {
    if (value === undefined) return null;
    return (
      <div>
        <span className="font-medium">{label}:</span> {value}{unit}
      </div>
    );
  };
  
  const renderExpandedView = () => {
    return (
      <>
        {renderNutritionItem("Calories", nutritionImpact?.calories)}
        {renderNutritionItem("Protein", nutritionImpact?.protein, 'g')}
        {renderNutritionItem("Carbs", nutritionImpact?.carbs, 'g')}
        {renderNutritionItem("Fat", nutritionImpact?.fat, 'g')}
        {renderNutritionItem("Fiber", nutritionImpact?.fiber, 'g')}
        {renderNutritionItem("Sugar", nutritionImpact?.sugar, 'g')}
        {renderNutritionItem("Sodium", nutritionImpact?.sodium, 'mg')}
      </>
    );
  };
  
  const renderConciseView = () => {
    return (
      <>
        {nutritionImpact?.calories && <div>Calories: {nutritionImpact.calories}</div>}
        {nutritionImpact?.protein && <div>Protein: {nutritionImpact.protein}g</div>}
        {nutritionImpact?.carbs && <div>Carbs: {nutritionImpact.carbs}g</div>}
      </>
    );
  };
  
  // Fix the nutrition impact rendering for the nutrition property
  const renderNutritionImpact = (impact: NutritionImpact) => {
    if (!impact) return null;
    return (
      <div className="p-4 border rounded-md bg-muted/20">
        <h4 className="font-medium mb-2">Nutrition Impact</h4>
        {impact.assessment && <p className="text-sm mb-2">{impact.assessment}</p>}
        {impact.summary && <p className="text-sm text-muted-foreground italic">{impact.summary}</p>}
      </div>
    );
  };
  
  return (
    <Card className={className}>
      <CardContent>
        {nutritionImpact && renderNutritionImpact(nutritionImpact)}
        <Separator className="my-2" />
        {expandedView ? renderExpandedView() : renderConciseView()}
      </CardContent>
    </Card>
  );
}
