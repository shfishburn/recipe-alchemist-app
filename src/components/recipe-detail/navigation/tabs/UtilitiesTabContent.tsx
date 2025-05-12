
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardWrapper } from '@/components/ui/card-wrapper';
import { RefreshCw, FlaskRound, Share, Printer, Trash2 } from 'lucide-react';
import type { Recipe } from '@/types/recipe';
import { useRecipeScience } from '@/hooks/use-recipe-science';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useDeleteRecipe } from '@/hooks/use-delete-recipe';
import { useNavigate } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface UtilitiesTabContentProps {
  recipe: Recipe;
}

export function UtilitiesTabContent({ recipe }: UtilitiesTabContentProps) {
  const { refetch, isLoading: isAnalyzing } = useRecipeScience(recipe);
  const { toast } = useToast();
  const { mutate: deleteRecipe, isDeleting } = useDeleteRecipe();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleForceRegenerate = () => {
    toast({
      title: "Force Regenerating Analysis",
      description: "Re-analyzing recipe with enhanced scientific detail...",
      duration: 5000
    });
    
    // Force the analysis to regenerate
    refetch?.(); // Use optional chaining to safely call refetch
  };

  // Placeholder handlers for other utilities
  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: `Check out this recipe: ${recipe.title}`,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      toast({
        title: "Share",
        description: "Sharing is not supported in this browser",
        duration: 3000
      });
    }
  };
  
  // Handler for deleting a recipe
  const handleDelete = () => {
    if (recipe && recipe.id) {
      deleteRecipe(recipe.id, {
        onSuccess: () => {
          toast({
            title: "Recipe deleted",
            description: "Your recipe has been moved to trash",
            duration: 3000
          });
          // Navigate back to the recipes list
          navigate('/recipes');
        },
        onError: (error) => {
          console.error('Delete recipe error:', error);
          toast({
            title: "Error",
            description: "Failed to delete recipe. Please try again.",
            variant: "destructive",
            duration: 5000
          });
        }
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <CardWrapper 
        title="Scientific Analysis" 
        description="Manage the recipe's scientific analysis data"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <FlaskRound className="h-5 w-5 text-recipe-blue" />
                Regenerate Analysis Data
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Force regenerate the scientific analysis data for this recipe. This will overwrite any existing analysis data.
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleForceRegenerate}
              disabled={isAnalyzing}
              className="flex items-center gap-1 whitespace-nowrap"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Force Regenerate
            </Button>
          </div>
          
          <Separator className="my-4" />
          
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">The scientific analysis includes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Chemistry breakdown of cooking processes</li>
              <li>Step-by-step reaction analysis</li>
              <li>Cooking techniques explanation</li>
              <li>Troubleshooting tips</li>
            </ul>
          </div>
        </div>
      </CardWrapper>
      
      <CardWrapper 
        title="Recipe Utilities" 
        description="Additional tools for this recipe"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium">Share Recipe</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Share this recipe with friends and family.
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
              className="flex items-center gap-1 whitespace-nowrap"
            >
              <Share className="h-3.5 w-3.5 mr-1" />
              Share
            </Button>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium">Print Recipe</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Print this recipe for your recipe collection.
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrint}
              className="flex items-center gap-1 whitespace-nowrap"
            >
              <Printer className="h-3.5 w-3.5 mr-1" />
              Print
            </Button>
          </div>

          <Separator className="my-4" />
          
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium">Delete Recipe</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Move this recipe to trash. It can be restored later from the trash.
              </p>
            </div>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1 whitespace-nowrap text-destructive border-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete Recipe
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to delete this recipe?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This recipe will be moved to trash. You can restore it later from the trash if needed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete} 
                    disabled={isDeleting}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Recipe'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardWrapper>
    </div>
  );
}
