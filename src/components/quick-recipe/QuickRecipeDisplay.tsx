
import React, { useState, useEffect } from 'react';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { QuickRecipeCard } from '@/components/quick-recipe/QuickRecipeCard';
import { useQuickRecipeSave } from '@/components/quick-recipe/QuickRecipeSave';
import { QuickRecipeModifier } from '@/components/quick-recipe/QuickRecipeModifier'; 
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Utensils, MessagesSquare } from 'lucide-react';

interface QuickRecipeDisplayProps {
  recipe: QuickRecipe;
}

export function QuickRecipeDisplay({ recipe }: QuickRecipeDisplayProps) {
  const { saveRecipe, isSaving } = useQuickRecipeSave();
  const [currentRecipe, setCurrentRecipe] = useState<QuickRecipe>(recipe);
  const [activeTab, setActiveTab] = useState<string>('recipe');

  // Check for URL hash to determine initial tab
  useEffect(() => {
    // If URL has #modify, open the modify tab
    if (window.location.hash === '#modify') {
      setActiveTab('modify');
    }
  }, []);

  const handleSave = async () => {
    toast("Saving your recipe...");
    await saveRecipe(currentRecipe);
  };

  const handleModifiedRecipe = (modifiedRecipe: QuickRecipe) => {
    setCurrentRecipe(modifiedRecipe);
  };

  return (
    <div className="space-y-4">
      <Tabs 
        defaultValue="recipe" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recipe" className="flex items-center gap-1.5">
            <Utensils className="h-4 w-4" />
            Recipe
          </TabsTrigger>
          <TabsTrigger value="modify" className="flex items-center gap-1.5">
            <MessagesSquare className="h-4 w-4" />
            Modify Recipe
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recipe" className="pt-4">
          <QuickRecipeCard
            recipe={currentRecipe}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </TabsContent>
        
        <TabsContent value="modify" className="pt-4">
          <QuickRecipeModifier 
            recipe={recipe}
            onModifiedRecipe={handleModifiedRecipe}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
