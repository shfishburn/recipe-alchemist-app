
import React, { useState } from 'react';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { QuickRecipeCard } from '@/components/quick-recipe/QuickRecipeCard';
import { QuickCookingMode } from '@/components/quick-recipe/QuickCookingMode';
import { useQuickRecipeSave } from '@/components/quick-recipe/QuickRecipeSave';
import { QuickRecipeChatDrawer } from './chat/QuickRecipeChatDrawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

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
      <QuickRecipeCard 
        recipe={recipe} 
        onCook={() => setCookModeOpen(true)}
        onSave={handleSave}
        onChatWithAi={() => setChatDrawerOpen(true)}
        isSaving={isSaving}
        showCookButton={false}
      />
      
      {/* Prominently display chat button since we're focusing on Quick Recipe chat */}
      <div className="mt-6 flex justify-center">
        <Button 
          onClick={() => setChatDrawerOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          size={isMobile ? "default" : "lg"}
        >
          <MessageCircle className="h-5 w-5" />
          Chat About This Recipe
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
