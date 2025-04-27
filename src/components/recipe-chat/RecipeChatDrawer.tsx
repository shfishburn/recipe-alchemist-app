
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { RecipeChat } from './RecipeChat';
import type { Recipe } from '@/types/recipe';

interface RecipeChatDrawerProps {
  recipe: Recipe;
  triggerRef?: React.RefObject<HTMLButtonElement>;
}

export function RecipeChatDrawer({ recipe, triggerRef }: RecipeChatDrawerProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="mt-4">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button 
            id="recipe-chat-trigger"
            ref={triggerRef}
            variant="outline" 
            size="sm" 
            className="w-full"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Recipe Chat
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[85vh] max-w-4xl mx-auto z-50">
          <DrawerHeader className="border-b">
            <DrawerTitle>Recipe Chat</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 flex-1 overflow-hidden flex flex-col h-[calc(85vh-60px)]">
            <div className="overflow-y-auto flex-1">
              <RecipeChat recipe={recipe} />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
