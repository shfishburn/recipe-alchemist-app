
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShareIcon } from 'lucide-react';
import { Recipe } from '@/types/recipe';

interface ShareButtonProps {
  recipe: Recipe;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export function ShareButton({ recipe, variant = 'outline' }: ShareButtonProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: recipe.tagline || `Check out this recipe for ${recipe.title}`,
        url: window.location.href,
      }).catch(error => {
        console.error('Error sharing:', error);
      });
    } else {
      // Fallback for browsers without native sharing
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    }
  };

  return (
    <Button 
      onClick={handleShare}
      variant={variant}
      size="sm"
      className="rounded-full"
    >
      <ShareIcon className="h-4 w-4 mr-2" />
      <span>Share</span>
    </Button>
  );
}
