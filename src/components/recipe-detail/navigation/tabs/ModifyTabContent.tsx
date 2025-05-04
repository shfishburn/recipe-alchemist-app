
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { RecipeChatDrawer } from '@/components/recipe-chat/RecipeChatDrawer';
import type { Recipe } from '@/types/recipe';

interface ModifyTabContentProps {
  recipe: Recipe;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  refetch: () => void;
}

export function ModifyTabContent({ recipe, chatOpen, setChatOpen, refetch }: ModifyTabContentProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-4">Modify This Recipe</h3>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Need to adjust this recipe? Chat with our AI to customize ingredients, 
          dietary requirements, or cooking methods to fit your needs.
        </p>
        
        <Button 
          onClick={() => setChatOpen(true)}
          size="lg"
          className="space-x-2"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Open Recipe Chat</span>
        </Button>
      </div>
      
      <RecipeChatDrawer 
        recipe={recipe} 
        open={chatOpen} 
        onOpenChange={setChatOpen}
      />
    </div>
  );
}
