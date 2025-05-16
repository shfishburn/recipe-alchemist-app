
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RecipeDisplay } from '../RecipeDisplay';
import { NutritionSummary } from '../NutritionSummary';
import { QuickRecipe } from '@/types/quick-recipe';
import { ModificationStatus, RecipeModifications } from '@/hooks/recipe-modifications/types';
import { Badge } from "@/components/ui/badge";
import { History, BugIcon } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [debugOpen, setDebugOpen] = useState(false);
  const isSuccess = status === 'success';
  const isApplying = status === 'applying';
  const isLoading = status === 'loading';
  const isApplied = status === 'applied';

  // Display version information if available
  const versionInfo = modifiedRecipe.version_info || 
                     (modifications?.recipe?.version_info);
  
  const formatJsonOutput = (obj: any): string => {
    return JSON.stringify(obj, null, 2);
  };

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
          <Dialog open={debugOpen} onOpenChange={setDebugOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" title="Debug AI Response">
                <BugIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>AI Modification Debug View</DialogTitle>
                <DialogDescription>
                  Raw data returned from the AI modification request
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Status</h4>
                  <code className="block p-2 bg-slate-100 rounded overflow-auto whitespace-pre text-xs">
                    {status}
                  </code>
                </div>
                {modifications && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Modifications</h4>
                    <code className="block p-2 bg-slate-100 rounded overflow-auto whitespace-pre text-xs max-h-[300px]">
                      {formatJsonOutput(modifications)}
                    </code>
                  </div>
                )}
                <div className="space-y-2">
                  <h4 className="font-medium">Modified Recipe</h4>
                  <code className="block p-2 bg-slate-100 rounded overflow-auto whitespace-pre text-xs max-h-[300px]">
                    {formatJsonOutput(modifiedRecipe)}
                  </code>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
