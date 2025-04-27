
import React, { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { RecipeChat } from './RecipeChat';
import type { Recipe } from '@/types/recipe';

interface RecipeChatDrawerProps {
  recipe: Recipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecipeChatDrawer({ recipe, open, onOpenChange }: RecipeChatDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
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
  );
}
