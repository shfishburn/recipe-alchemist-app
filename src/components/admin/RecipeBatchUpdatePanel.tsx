
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, RefreshCw, Database, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { updateAllRecipeNutritionData } from '@/scripts/update-nutrition-data';
import { updateRecipeScienceData } from '@/utils/nutrition/update-science-data';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BatchUpdateResult {
  status: string;
  totalRecipes: number;
  updatedRecipes: number;
  errorCount: number;
  dryRun: boolean;
  updateType?: string;
}

export function RecipeBatchUpdatePanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BatchUpdateResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('nutrition');

  const runNutritionUpdate = async (dryRun: boolean) => {
    try {
      setIsLoading(true);
      setResult(null);
      setProgress(10); // Show initial progress

      // Run the update function
      const updateResult = await updateAllRecipeNutritionData(dryRun);
      setProgress(100);
      setResult(updateResult as BatchUpdateResult);
      
      // Show toast notification based on result
      if (dryRun) {
        toast.info(`Dry run completed: ${updateResult.totalRecipes} recipes analyzed`);
      } else {
        toast.success(`Update completed: ${updateResult.updatedRecipes} recipes updated`);
      }
    } catch (error) {
      console.error('Error updating recipes:', error);
      toast.error('Failed to update recipes. Check console for details.');
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const runScienceUpdate = async (dryRun: boolean) => {
    try {
      setIsLoading(true);
      setResult(null);
      setProgress(10); // Show initial progress

      // Run the science update function
      const updateResult = await updateRecipeScienceData(dryRun);
      setProgress(100);
      setResult(updateResult as BatchUpdateResult);
      
      // Show toast notification based on result
      if (dryRun) {
        toast.info(`Science dry run completed: ${updateResult.totalRecipes} recipes analyzed`);
      } else {
        toast.success(`Science update completed: ${updateResult.updatedRecipes} recipes updated`);
      }
    } catch (error) {
      console.error('Error updating recipe science data:', error);
      toast.error('Failed to update science data. Check console for details.');
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Recipe Batch Updates</h2>
      </div>

      <Tabs defaultValue="nutrition" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nutrition">Nutrition Updates</TabsTrigger>
          <TabsTrigger value="science">Science Updates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nutrition" className="space-y-4 mt-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Update nutrition data for all recipes using the latest standardized format.
              Run a dry run first to see how many recipes would be affected.
            </p>
            
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                size="sm"
                disabled={isLoading}
                onClick={() => runNutritionUpdate(true)}
                leftIcon={<Database className="w-4 h-4" />}
              >
                Dry Run
              </Button>
              
              <Button
                variant="default"
                size="sm" 
                disabled={isLoading}
                onClick={() => runNutritionUpdate(false)}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Update All Recipes
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="science" className="space-y-4 mt-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Update science notes and analysis data for all recipes.
              This will standardize format and structure of science information.
            </p>
            
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                size="sm"
                disabled={isLoading}
                onClick={() => runScienceUpdate(true)}
                leftIcon={<FileText className="w-4 h-4" />}
              >
                Dry Run
              </Button>
              
              <Button
                variant="default"
                size="sm" 
                disabled={isLoading}
                onClick={() => runScienceUpdate(false)}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Update All Recipes
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {isLoading && (
        <div className="space-y-2">
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {result && (
        <div className="bg-slate-50 p-4 rounded-md space-y-2">
          <h4 className="font-medium">Result Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Total recipes:</div>
            <div className="font-mono">{result.totalRecipes}</div>
            
            <div>Updated recipes:</div>
            <div className="font-mono">{result.updatedRecipes}</div>
            
            <div>Errors:</div>
            <div className="font-mono">{result.errorCount}</div>
            
            <div>Mode:</div>
            <div className="font-mono">{result.dryRun ? 'Dry run' : 'Live update'}</div>
            
            {result.updateType && (
              <>
                <div>Update type:</div>
                <div className="font-mono">{result.updateType}</div>
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
