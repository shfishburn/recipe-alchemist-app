
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChefHat, FlaskConical, MessageSquare, Printer, Share2, Trash2 } from 'lucide-react';
import { useDeleteRecipe } from '@/hooks/use-delete-recipe';
import type { Recipe } from '@/types/recipe';

interface RecipeActionsProps {
  recipe: Recipe;
  sticky?: boolean;
  onOpenChat: () => void;
}

export function RecipeActions({ recipe, sticky = false, onOpenChat }: RecipeActionsProps) {
  const navigate = useNavigate();
  const { mutate: deleteRecipe } = useDeleteRecipe();
  const [isSticky, setIsSticky] = React.useState(false);
  
  React.useEffect(() => {
    if (!sticky) return;
    
    const handleScroll = () => {
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

  const handleAnalyze = () => {
    onOpenChat();
    // We'll pre-populate the chat with a scientific analysis request
    const analysisMessage = "Please provide a detailed scientific analysis of this recipe, including chemical processes, cooking techniques, and troubleshooting tips.";
    const chatInput = document.querySelector('textarea[name="recipe-chat"]') as HTMLTextAreaElement;
    if (chatInput) {
      chatInput.value = analysisMessage;
      const event = new Event('input', { bubbles: true });
      chatInput.dispatchEvent(event);
    }
  };
  
  const containerClasses = sticky && isSticky 
    ? "fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-30 transition-all duration-300"
    : "relative w-full";
  
  return (
    <div className={containerClasses}>
      <div className="container max-w-4xl mx-auto p-4 space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant="default" 
            size="lg"
            className="w-full"
            onClick={() => window.document.getElementById('cooking-mode-trigger')?.click()}
          >
            <ChefHat className="h-5 w-5 mr-2" />
            Cooking Mode
          </Button>

          <Button 
            variant="default"
            size="lg"
            className="w-full"
            onClick={handleAnalyze}
          >
            <FlaskConical className="h-5 w-5 mr-2" />
            Analyze Recipe
          </Button>
          
          <Button 
            variant="default"
            size="lg"
            className="w-full"
            onClick={onOpenChat}
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            AI Chat
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={() => window.document.getElementById('print-recipe-trigger')?.click()}
            title="Print Recipe"
          >
            <Printer className="h-5 w-5" />
          </Button>
          
          {navigator.share && (
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={shareRecipe}
              title="Share Recipe"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          )}
          
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
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
