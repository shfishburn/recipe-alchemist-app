
import React from 'react';
import { Button } from '@/components/ui/button';
import { CookingPot, Bookmark, Printer } from 'lucide-react';

interface RecipeActionButtonsProps {
  onCook: () => void;
  onSave: () => void;
  onPrint?: () => void;
  isSaving?: boolean;
}

export function RecipeActionButtons({ 
  onCook, 
  onSave, 
  onPrint,
  isSaving = false 
}: RecipeActionButtonsProps) {
  return (
    <div className="pt-4 flex flex-col gap-2 w-full">
      {/* Primary action - Start Cooking */}
      <Button 
        onClick={onCook} 
        className="w-full bg-recipe-blue hover:bg-recipe-blue/90"
        size="lg"
      >
        <CookingPot className="mr-2 h-5 w-5" />
        Start Cooking
      </Button>
      
      {/* Secondary actions in a proper grid layout */}
      <div className="grid grid-cols-2 gap-2 w-full">
        <Button 
          variant="outline" 
          onClick={onSave}
          className="w-full"
          disabled={isSaving}
        >
          <Bookmark className="mr-1 sm:mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Save Recipe</span>
          <span className="sm:hidden">Save</span>
        </Button>
        <Button 
          variant="outline" 
          onClick={onPrint}
          className="w-full"
        >
          <Printer className="mr-1 sm:mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Print</span>
          <span className="sm:hidden">Print</span>
        </Button>
      </div>
    </div>
  );
}
