
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RecipeDisplay } from '../RecipeDisplay';
import { NutritionSummary } from '../NutritionSummary';
import { QuickRecipe } from '@/types/quick-recipe';
import { ModificationStatus, RecipeModifications } from '@/hooks/recipe-modifications/types';
import { Badge } from "@/components/ui/badge";
import { History } from 'lucide-react';

interface ModifiedRecipeDisplayProps {
  modifiedRecipe: QuickRecipe;
  modifications: RecipeModifications | null;
  status: ModificationStatus;
  onApplyModifications: () => void;
  onRejectModifications: () => void;
  onResetToOriginal: () => void;
  isHistoricalVersion?: boolean;
}

export const ModifiedRecipeDisplay: React.FC<ModifiedRecipeDisplayProps> = ({
  modifiedRecipe,
  modifications,
  status,
  onApplyModifications,
  onRejectModifications,
  onResetToOriginal,
  isHistoricalVersion = false
}) => {
  const isSuccess = status === 'success';
  const isApplying = status === 'applying';
  const isLoading = status === 'loading';
  const isApplied = status === 'applied';

  // Display version information if available
  const versionInfo = modifiedRecipe.version_info || 
                     (modifications?.recipe?.version_info);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              Modified Recipe
              {isHistoricalVersion && (
                <Badge variant="outline" className="ml-2">
                  <History className="w-3 h-3 mr-1" /> Historical Version
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              View the modified recipe and apply changes.
              {versionInfo && (
                <span className="block text-xs mt-1">
                  Version {versionInfo.version_number}
                  {versionInfo.modification_reason && (
                    <> - {versionInfo.modification_reason}</>
                  )}
                </span>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <RecipeDisplay recipe={modifiedRecipe} />
        {modifications?.nutritionImpact && (
          <div>
            <h4 className="text-sm font-medium mb-2">Nutrition Impact</h4>
            <NutritionSummary nutrition={modifications.nutritionImpact} />
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between flex-wrap gap-2">
        {isSuccess && (
          <>
            <Button 
              onClick={onApplyModifications} 
              disabled={isApplying}
              className="flex-1"
            >
              {isApplying ? 'Applying...' : 'Apply Modifications'}
            </Button>
            <Button 
              variant="secondary" 
              onClick={onRejectModifications}
              className="flex-1"
            >
              Reject Modifications
            </Button>
          </>
        )}
        <Button 
          variant="destructive" 
          onClick={onResetToOriginal} 
          disabled={isLoading || isApplying}
          className={isSuccess ? "mt-2 w-full" : "flex-1"}
          size={isSuccess ? "sm" : "default"}
        >
          Reset to Original
        </Button>
      </CardFooter>
    </Card>
  );
};
