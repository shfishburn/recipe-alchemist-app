
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChefHat, FlaskConical, MessageSquare, Printer, Share2, Trash2, Loader2 } from 'lucide-react';
import { useDeleteRecipe } from '@/hooks/use-delete-recipe';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Recipe } from '@/types/recipe';

interface RecipeActionsProps {
  recipe: Recipe;
  sticky?: boolean;
  onOpenChat: () => void;
  onToggleAnalysis: () => void;
  showingAnalysis: boolean;
  isAnalyzing?: boolean;
}

export function RecipeActions({ 
  recipe, 
  sticky = false, 
  onOpenChat, 
  onToggleAnalysis, 
  showingAnalysis,
  isAnalyzing = false 
}: RecipeActionsProps) {
  const navigate = useNavigate();
  const { mutate: deleteRecipe } = useDeleteRecipe();
  const [isSticky, setIsSticky] = React.useState(false);
  const isMobile = useIsMobile();
  
  React.useEffect(() => {
    if (!sticky) return;
    
    const handleScroll = () => {
      // Adjusted to account for the taller navbar (h-20 = 80px)
      setIsSticky(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sticky]);
  
  const shareRecipe = async () => {
    if (!navigator.share) return;
    
    try {
      await navigator.share({
        title: recipe.title,
        text: recipe.tagline || `Check out this ${recipe.cuisine || ''} recipe for ${recipe.title}`,
        url: window.location.href,
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleDelete = () => {
    deleteRecipe(recipe.id);
    navigate('/recipes');
  };

  const containerClasses = sticky && isSticky 
    ? "fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-30 transition-all duration-300"
    : "relative w-full";
  
  return (
    <div className={containerClasses}>
      <div className="container max-w-4xl mx-auto p-4 space-y-3">
        {/* Main action buttons - Stacked on mobile, horizontal on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button 
            variant="default"
            size={isMobile ? "default" : "lg"}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => window.document.getElementById('cooking-mode-trigger')?.click()}
          >
            <ChefHat className="h-5 w-5 mr-2" />
            <span className="whitespace-nowrap">
              {isMobile ? "Cooking Mode" : "Cooking Mode"}
            </span>
          </Button>

          <Button 
            variant="default"
            size={isMobile ? "default" : "lg"}
            className={`w-full ${showingAnalysis ? 'bg-primary/80' : 'bg-primary'} hover:bg-primary/90 text-primary-foreground`}
            onClick={onToggleAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <FlaskConical className="h-5 w-5 mr-2" />
            )}
            <span className="whitespace-nowrap">
              {isMobile ? (isAnalyzing ? "Analyzing..." : "Analyze") : (isAnalyzing ? "Analyzing..." : "Analyze Recipe")}
            </span>
          </Button>
          
          <Button 
            variant="default"
            size={isMobile ? "default" : "lg"}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={onOpenChat}
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            <span className="whitespace-nowrap">
              {isMobile ? "AI Chat" : "AI Chat"}
            </span>
          </Button>
        </div>

        {/* Secondary utility buttons */}
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 bg-white"
            onClick={() => window.document.getElementById('print-recipe-trigger')?.click()}
            title="Print Recipe"
          >
            <Printer className="h-5 w-5" />
          </Button>
          
          {navigator.share && (
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 bg-white"
              onClick={shareRecipe}
              title="Share Recipe"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          )}
          
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 bg-white"
            onClick={handleDelete}
            title="Delete Recipe"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
