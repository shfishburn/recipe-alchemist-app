
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat, FlaskConical, MessageSquare, Printer, Share2, Trash2, Loader2 } from 'lucide-react';
import { useDeleteRecipe } from '@/hooks/use-delete-recipe';
import { useIsMobile } from '@/hooks/use-mobile';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
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
  const { mutate: deleteRecipe, isDeleting } = useDeleteRecipe();
  const [isSticky, setIsSticky] = React.useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
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
    if (showDeleteAlert) {
      deleteRecipe(recipe.id, {
        onSuccess: () => {
          // Only navigate after the mutation has successfully completed
          setTimeout(() => navigate('/recipes'), 100);
        }
      });
      setShowDeleteAlert(false);
    } else {
      setShowDeleteAlert(true);
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteAlert(false);
  };

  const containerClasses = sticky && isSticky 
    ? "fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-30 transition-all duration-300"
    : "relative w-full";

  // Format button text for mobile vs desktop
  const analyzeText = isMobile 
    ? (isAnalyzing ? "Analyzing..." : "Analyze") 
    : (isAnalyzing ? "Analyzing..." : "Analyze Recipe");
  
  const aiChatText = isMobile ? "AI Chat" : "AI Chat";
  const cookingModeText = isMobile ? "Cooking Mode" : "Cooking Mode";
  
  return (
    <div className={containerClasses}>
      <div className="container max-w-4xl mx-auto p-3 sm:p-4 space-y-3">
        {showDeleteAlert && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Are you sure?</AlertTitle>
            <AlertDescription>
              This will delete the recipe "{recipe.title}".
              <div className="mt-2 flex gap-2">
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Trash2 className="h-4 w-4 mr-1" />}
                  {isDeleting ? "Deleting..." : "Yes, delete it"}
                </Button>
                <Button variant="outline" onClick={cancelDelete}>
                  Cancel
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Main action buttons - Stacked on mobile, horizontal on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button 
            variant="default"
            size={isMobile ? "default" : "lg"}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center"
            onClick={() => window.document.getElementById('cooking-mode-trigger')?.click()}
          >
            <ChefHat className="h-5 w-5 mr-2" />
            <span className="whitespace-nowrap">
              {cookingModeText}
            </span>
          </Button>

          <Button 
            variant="default"
            size={isMobile ? "default" : "lg"}
            className={`w-full ${showingAnalysis ? 'bg-primary/80' : 'bg-primary'} hover:bg-primary/90 text-primary-foreground flex items-center justify-center`}
            onClick={onToggleAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <FlaskConical className="h-5 w-5 mr-2" />
            )}
            <span className="whitespace-nowrap">
              {analyzeText}
            </span>
            {showingAnalysis && <Badge variant="success" className="ml-2 text-[10px]">Active</Badge>}
          </Button>
          
          <Button 
            variant="default"
            size={isMobile ? "default" : "lg"}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center"
            onClick={onOpenChat}
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            <span className="whitespace-nowrap">
              {aiChatText}
            </span>
          </Button>
        </div>

        {/* Secondary utility buttons */}
        <div className="flex justify-center gap-3">
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
            className={`h-10 w-10 bg-white ${showDeleteAlert ? 'ring-2 ring-destructive' : ''}`}
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete Recipe"
          >
            {isDeleting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Trash2 className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
