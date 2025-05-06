
import React, { useState } from 'react';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { QuickRecipeCard } from '@/components/quick-recipe/QuickRecipeCard';
import { QuickCookingMode } from '@/components/quick-recipe/QuickCookingMode';
import { useQuickRecipeSave } from '@/components/quick-recipe/QuickRecipeSave';
import { QuickRecipeChatDrawer } from './chat/QuickRecipeChatDrawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MessageCircle, Info } from 'lucide-react';

interface QuickRecipeDisplayProps {
  recipe: QuickRecipe;
}

export function QuickRecipeDisplay({ recipe }: QuickRecipeDisplayProps) {
  const [cookModeOpen, setCookModeOpen] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const { saveRecipe, isSaving, navigate } = useQuickRecipeSave();
  const isMobile = useIsMobile();
  
  const handleSave = async () => {
    const success = await saveRecipe(recipe);
    // Only navigate if save was successful
    if (success) {
      navigate('/recipes');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-16">
      {/* Deprecation Notice - Important information at the top */}
      <Alert className="mb-6 bg-amber-50 border-amber-200">
        <Info className="h-4 w-4 text-amber-500" />
        <AlertTitle className="text-amber-700">Recipe Chat Update</AlertTitle>
        <AlertDescription className="text-amber-600">
          We're focusing exclusively on Quick Recipe chat. Standard recipe chat is being phased out.
        </AlertDescription>
      </Alert>
      
      <QuickRecipeCard 
        recipe={recipe} 
        onCook={() => setCookModeOpen(true)}
        onSave={handleSave}
        onChatWithAi={() => setChatDrawerOpen(true)}
        isSaving={isSaving}
        showCookButton={true}
      />
      
      {/* Action buttons with improved layout */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={() => setChatDrawerOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 flex-1"
          size={isMobile ? "default" : "lg"}
        >
          <MessageCircle className="h-5 w-5" />
          Chat About Recipe
        </Button>
        
        <Button 
          onClick={() => setCookModeOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
          size={isMobile ? "default" : "lg"}
        >
          Start Cooking
        </Button>
      </div>
      
      {/* Dialog for cooking mode */}
      <QuickCookingMode 
        recipe={recipe}
        open={cookModeOpen}
        onOpenChange={setCookModeOpen}
      />
      
      {/* Chat drawer for AI interactions */}
      <QuickRecipeChatDrawer
        recipe={recipe}
        open={chatDrawerOpen}
        onOpenChange={setChatDrawerOpen}
      />
    </div>
  );
}
