
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import { ShareRecipeDialog } from './ShareRecipeDialog';
import type { Recipe } from '@/types/recipe';

interface ShareButtonProps {
  recipe: Recipe;
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link";
}

export function ShareButton({ recipe, variant = "default" }: ShareButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  return (
    <>
      <Button 
        variant={variant} 
        size="sm" 
        className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-black"
        onClick={() => setDialogOpen(true)}
        aria-label="Share recipe"
      >
        <Share className="h-4 w-4" />
      </Button>
      
      <ShareRecipeDialog 
        recipe={recipe} 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
      />
    </>
  );
}
