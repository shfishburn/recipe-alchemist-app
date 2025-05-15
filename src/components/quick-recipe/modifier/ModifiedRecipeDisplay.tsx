
import React from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RecipeDisplay } from '../RecipeDisplay';
import { NutritionSummary } from '../NutritionSummary';
import { QuickRecipe } from '@/types/quick-recipe';
import { ModificationStatus, RecipeModifications } from '@/hooks/recipe-modifications';

interface ModifiedRecipeDisplayProps {
  modifiedRecipe: QuickRecipe;
  modifications: RecipeModifications | null;
  status: ModificationStatus;
  onApplyModifications: () => void;
  onRejectModifications: () => void;
  onResetToOriginal: () => void;
}

export const ModifiedRecipeDisplay: React.FC<ModifiedRecipeDisplayProps> = ({
  modifiedRecipe,
  modifications,
  status,
  onApplyModifications,
  onRejectModifications,
  onResetToOriginal
}) => {
  const isSuccess = status === 'success';
  const isApplying = status === 'applying';
  const isLoading = status === 'loading';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modified Recipe</CardTitle>
        <CardDescription>View the modified recipe and apply changes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RecipeDisplay recipe={modifiedRecipe} />
        {modifications && (
          <NutritionSummary nutrition={modifications.nutritionImpact} />
        )}
      </CardContent>
      <CardFooter className="justify-between">
        {isSuccess && (
          <>
            <Button onClick={onApplyModifications} disabled={isApplying}>
              {isApplying ? 'Applying...' : 'Apply Modifications'}
            </Button>
            <Button variant="secondary" onClick={onRejectModifications}>
              Reject Modifications
            </Button>
          </>
        )}
        <Button 
          variant="destructive" 
          onClick={onResetToOriginal} 
          disabled={isLoading || isApplying}
        >
          Reset to Original
        </Button>
      </CardFooter>
    </Card>
  );
};
