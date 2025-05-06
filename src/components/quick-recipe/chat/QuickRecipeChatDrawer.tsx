
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
import { QuickRecipeChat } from './QuickRecipeChat';
import type { QuickRecipe } from '@/hooks/use-quick-recipe';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuickRecipeChat } from '@/hooks/use-quick-recipe-chat';

interface QuickRecipeChatDrawerProps {
  recipe: QuickRecipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickRecipeChatDrawer({ recipe, open, onOpenChange }: QuickRecipeChatDrawerProps) {
  const isMobile = useIsMobile();
  const contentRef = useRef<HTMLDivElement>(null);
  
  const {
    isSending,
    isApplying
  } = useQuickRecipeChat(recipe);
  
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
        className={`${isMobile ? 'h-[87vh]' : 'h-[85vh]'} max-w-4xl mx-auto overflow-hidden flex flex-col drawer-content image-view-touch`} 
        style={{ zIndex: 50 }}
        ref={contentRef}
      >
        <DrawerHeader className="border-b flex items-center justify-between bg-white py-2 sticky top-0 z-10">
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
                <TooltipTrigger>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-8 w-8 touch-target-base"
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
        <div className={`p-2 sm:p-4 flex-1 ${isMobile ? 'h-[calc(87vh-48px)]' : 'h-[calc(85vh-60px)]'} flex`}>
          <QuickRecipeChat recipe={recipe} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
