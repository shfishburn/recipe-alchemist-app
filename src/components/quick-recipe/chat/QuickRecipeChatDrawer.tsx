
import React, { useEffect, useRef } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { X, Loader2, MessageCircle } from 'lucide-react';
import { QuickRecipeChat } from './QuickRecipeChat';
import type { QuickRecipe } from '@/hooks/use-quick-recipe';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUnifiedRecipeChat } from '@/hooks/use-unified-recipe-chat';

interface QuickRecipeChatDrawerProps {
  recipe: QuickRecipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickRecipeChatDrawer({ recipe, open, onOpenChange }: QuickRecipeChatDrawerProps) {
  const isMobile = useIsMobile();
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Get essential state from unified chat hook without creating full UI elements
  const {
    isSending,
    isApplying
  } = useUnifiedRecipeChat(recipe);
  
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
  
  // Use fixed height values instead of dynamic calculations for more stability
  const drawerHeight = isMobile ? '85vh' : '80vh';
  const contentHeight = isMobile ? 'calc(85vh - 60px)' : 'calc(80vh - 60px)';
  
  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent 
        className={`max-w-4xl mx-auto overflow-hidden flex flex-col drawer-content image-view-touch`} 
        style={{ height: drawerHeight, zIndex: 50 }}
        ref={contentRef}
      >
        <DrawerHeader className="border-b flex items-center justify-between bg-white py-3 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            <DrawerTitle className="text-lg font-medium text-slate-800">
              Recipe Chat
              {isPending && (
                <span className="ml-2 text-xs text-muted-foreground">
                  (Processing...)
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
                    className="rounded-full h-9 w-9 hover:bg-slate-100"
                    onClick={() => !isPending && onOpenChange(false)}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-5 w-5" />
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
        
        <div className="p-2 sm:p-4 flex-1 w-full overflow-hidden" style={{ height: contentHeight }}>
          <QuickRecipeChat recipe={recipe} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
