
import React, { useEffect, useRef } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { X, Loader2 } from 'lucide-react';
import { RecipeChat } from './RecipeChat';
import type { Recipe } from '@/types/recipe';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRecipeChat } from '@/hooks/use-recipe-chat';

interface RecipeChatDrawerProps {
  recipe: Recipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecipeChatDrawer({ recipe, open, onOpenChange }: RecipeChatDrawerProps) {
  const isMobile = useIsMobile();
  const contentRef = useRef<HTMLDivElement>(null);
  
  const {
    isSending,
    isApplying
  } = useRecipeChat(recipe);
  
  const isPending = isSending || isApplying;
  
  const handleOpenChange = (newOpenState: boolean) => {
    if (newOpenState === false && isPending) {
      return;
    }
    
    onOpenChange(newOpenState);
  };
  
  // Reset scroll position when drawer opens
  useEffect(() => {
    if (open && contentRef.current) {
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
        }
      }, 100);
    }
  }, [open]);
  
  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent 
        className={`${isMobile ? 'h-[95vh]' : 'h-[85vh]'} max-w-4xl mx-auto flex flex-col hw-boost`} 
        style={{ zIndex: 50 }} // Lower z-index than shopping list components
        ref={contentRef}
      >
        <DrawerHeader className="flex-shrink-0 border-b flex items-center justify-between bg-white py-2 sticky top-0 z-10 hw-boost">
          <div className="flex items-center gap-2">
            <DrawerTitle className="text-primary font-medium text-base">
              Recipe Chat
              {isPending && (
                <span className="ml-2 text-xs text-muted-foreground">
                  (Processing request...)
                </span>
              )}
            </DrawerTitle>
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-8 w-8 touch-active"
                    onClick={() => !isPending && onOpenChange(false)}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    <span className="sr-only">Close</span>
                  </Button>
                </TooltipTrigger>
                {isPending && (
                  <TooltipContent>
                    <p>Please wait until the current operation completes</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </DrawerHeader>
        <div className="flex-1 min-h-0 p-2 sm:p-4 overflow-hidden">
          <div className="w-full h-full"> {/* Added wrapper with explicit height/width */}
            <RecipeChat recipe={recipe} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
