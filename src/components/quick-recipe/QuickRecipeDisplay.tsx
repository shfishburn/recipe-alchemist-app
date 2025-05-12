
import React, { useState } from 'react';
import { QuickRecipe } from '@/types/quick-recipe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecipeActionButtons } from '@/components/quick-recipe/card/RecipeActionButtons';
import { QuickRecipeIngredients } from '@/components/quick-recipe/QuickRecipeIngredients';
import { QuickRecipeInstructions } from '@/components/quick-recipe/QuickRecipeInstructions';
import { useQuickRecipeSave } from '@/components/quick-recipe/QuickRecipeSave';
import { toast } from '@/hooks/use-toast';

interface QuickRecipeDisplayProps {
  recipe: QuickRecipe;
}

export function QuickRecipeDisplay({ recipe }: QuickRecipeDisplayProps) {
  const [activeTab, setActiveTab] = useState('ingredients');
  const { saveRecipe, isSaving } = useQuickRecipeSave();
  
  const handleSave = async () => {
    try {
      await saveRecipe(recipe);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-serif text-center">
          {recipe.title}
        </CardTitle>
        
        {recipe.description && (
          <p className="text-sm text-muted-foreground text-center mt-1">
            {recipe.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ingredients" className="mt-4">
            <QuickRecipeIngredients ingredients={recipe.ingredients} />
          </TabsContent>
          
          <TabsContent value="instructions" className="mt-4">
            <QuickRecipeInstructions 
              instructions={recipe.instructions || recipe.steps}
            />
          </TabsContent>
        </Tabs>
        
        <RecipeActionButtons onSave={handleSave} isSaving={isSaving} />
      </CardContent>
    </Card>
  );
}
