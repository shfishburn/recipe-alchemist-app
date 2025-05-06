
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { CookingPot, Bookmark, MessageSquare } from 'lucide-react';

interface RecipeActionButtonsProps {
  onCook?: () => void;
  onSave: () => void;
  onChatWithAi?: () => void;
  isSaving?: boolean;
  isSmallScreen?: boolean;
  showCookButton?: boolean;
}

// Use memo to prevent unnecessary re-renders
export const RecipeActionButtons = memo(function RecipeActionButtons({ 
  onCook, 
  onSave, 
  onChatWithAi,
  isSaving = false,
  isSmallScreen = false,
  showCookButton = true
}: RecipeActionButtonsProps) {
  return (
    <div className="pt-5 flex flex-col gap-2.5 w-full">
      {/* Primary action - Start Cooking (only shown when showCookButton is true) */}
      {showCookButton && onCook && (
        <Button 
          onClick={onCook} 
          className="w-full bg-recipe-blue hover:bg-recipe-blue/90 touch-feedback-strong"
          size="lg"
        >
          <CookingPot className="mr-2 h-5 w-5" />
          Start Cooking
        </Button>
      )}
      
      {/* Secondary actions in a proper grid layout */}
      <div className={`grid ${(showCookButton || !onChatWithAi) ? 'grid-cols-2' : 'grid-cols-1'} gap-2.5 w-full`}>
        <Button 
          variant="outline" 
          onClick={onSave}
          className="w-full touch-feedback-optimized"
          disabled={isSaving}
        >
          <Bookmark className="mr-1 sm:mr-2 h-4 w-4" />
          <span className={isSmallScreen ? "hidden" : "inline"}>Save Recipe</span>
          <span className={isSmallScreen ? "inline" : "hidden"}>Save</span>
        </Button>
        
        {onChatWithAi && (
          <Button 
            variant="outline" 
            onClick={onChatWithAi}
            className="w-full touch-feedback-optimized"
          >
            <MessageSquare className="mr-1 sm:mr-2 h-4 w-4" />
            <span className={isSmallScreen ? "hidden" : "inline"}>Chat with AI</span>
            <span className={isSmallScreen ? "inline" : "hidden"}>Chat</span>
          </Button>
        )}
      </div>
    </div>
  );
});
