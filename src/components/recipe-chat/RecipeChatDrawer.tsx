
import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { RecipeChat } from './RecipeChat';
import type { Recipe } from '@/types/recipe';
import { useIsMobile } from '@/hooks/use-mobile';

interface RecipeChatDrawerProps {
  recipe: Recipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecipeChatDrawer({ recipe, open, onOpenChange }: RecipeChatDrawerProps) {
  const isMobile = useIsMobile();
  
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={`${isMobile ? 'h-[95vh]' : 'h-[85vh]'} max-w-4xl mx-auto z-50`}>
        <DrawerHeader className="border-b flex items-center justify-between bg-white py-2">
          <DrawerTitle className="text-primary font-medium text-base">Recipe Chat</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className={`p-2 sm:p-4 flex-1 overflow-hidden flex flex-col ${isMobile ? 'h-[calc(95vh-48px)]' : 'h-[calc(85vh-60px)]'} bg-[#F9FAFB]`}>
          <div className="overflow-y-auto flex-1">
            <RecipeChat recipe={recipe} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
