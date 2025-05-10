
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardWrapper } from '@/components/ui/card-wrapper';
import { RefreshCw, FlaskRound } from 'lucide-react';
import type { Recipe } from '@/types/recipe';
import { useRecipeScience } from '@/hooks/use-recipe-science';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface UtilitiesTabContentProps {
  recipe: Recipe;
}

export function UtilitiesTabContent({ recipe }: UtilitiesTabContentProps) {
  const { analyzeRecipe, isAnalyzing } = useRecipeScience(recipe);
  const { toast } = useToast();

  const handleForceRegenerate = () => {
    toast({
      title: "Force Regenerating Analysis",
      description: "Re-analyzing recipe with enhanced scientific detail...",
      duration: 5000
    });
    
    // Force the analysis to regenerate
    analyzeRecipe(true); // Pass true to force regeneration
  };
  
  return (
    <div className="space-y-6">
      <CardWrapper 
        title="Scientific Analysis" 
        description="Manage the recipe's scientific analysis data"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <FlaskRound className="h-5 w-5 text-recipe-blue" />
                Regenerate Analysis Data
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Force regenerate the scientific analysis data for this recipe. This will overwrite any existing analysis data.
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleForceRegenerate}
              disabled={isAnalyzing}
              className="flex items-center gap-1 whitespace-nowrap"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Force Regenerate
            </Button>
          </div>
          
          <Separator className="my-4" />
          
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">The scientific analysis includes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Chemistry breakdown of cooking processes</li>
              <li>Step-by-step reaction analysis</li>
              <li>Cooking techniques explanation</li>
              <li>Troubleshooting tips</li>
            </ul>
          </div>
        </div>
      </CardWrapper>
      
      {/* Other utility sections can be added here */}
    </div>
  );
}
