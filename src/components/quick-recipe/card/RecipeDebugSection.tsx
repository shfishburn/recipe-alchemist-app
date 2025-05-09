
import React, { useState } from 'react';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';

interface RecipeDebugSectionProps {
  recipe: QuickRecipe;
}

export function RecipeDebugSection({ recipe }: RecipeDebugSectionProps) {
  const [showDebug, setShowDebug] = useState(false);
  
  // Only show debug section in development environment
  const isDevelopment = import.meta.env.DEV;
  
  if (!isDevelopment) {
    return null; // Don't render anything in production
  }

  // Function to copy JSON to clipboard
  const copyJsonToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(recipe, null, 2))
      .then(() => {
        alert('JSON copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy JSON:', err);
      });
  };
  
  return (
    <div className="pt-2">
      <Collapsible>
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center text-xs text-muted-foreground hover:text-foreground p-1"
              onClick={() => setShowDebug(!showDebug)}
            >
              <Bug className="h-3 w-3 mr-1" />
              {showDebug ? 'Hide' : 'Show'} Debug Info
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="mt-4 border rounded-md p-4 bg-slate-50">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Raw Recipe JSON</h4>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={copyJsonToClipboard}
              >
                Copy JSON
              </Button>
            </div>
            <Separator className="my-2" />
            <pre className="text-xs overflow-auto bg-slate-100 p-2 rounded-md max-h-80">
              {JSON.stringify(recipe, null, 2)}
            </pre>
            <div className="mt-4 text-xs text-muted-foreground">
              <p><strong>Metadata:</strong></p>
              <ul className="list-disc pl-5 mt-1">
                <li>Steps count: {recipe.steps.length}</li>
                <li>Ingredients count: {recipe.ingredients.length}</li>
                <li>Has cooking tip: {recipe.cookingTip ? 'Yes' : 'No'}</li>
                <li>Recipe type: {recipe.cuisine || 'Not specified'}</li>
              </ul>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
