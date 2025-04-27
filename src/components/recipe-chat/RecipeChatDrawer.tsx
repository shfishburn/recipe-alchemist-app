
import React from 'react';
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
}

export function RecipeChatDrawer({ recipe }: RecipeChatDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1 md:flex-none md:w-auto">
          <MessageCircle className="h-4 w-4 mr-2" />
          Recipe Chat
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
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
  );
}
