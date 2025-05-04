
import React, { useState, useRef } from 'react';
import { Printer, Share2, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PrintRecipe } from '@/components/recipe-detail/PrintRecipe';
import { ShareRecipeDialog } from '@/components/recipe-detail/ShareRecipeDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useDeleteRecipe } from '@/hooks/use-delete-recipe';
import type { Recipe } from '@/types/recipe';

interface UtilitiesTabContentProps {
  recipe: Recipe;
}

export function UtilitiesTabContent({ recipe }: UtilitiesTabContentProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const printRecipeRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { mutate: deleteRecipe, isDeleting } = useDeleteRecipe();

  // Handle printing
  const handlePrint = () => {
    if (printRecipeRef.current) {
      printRecipeRef.current.click();
    }
  };

  // Handle sharing
  const handleShare = () => {
    setShowShareDialog(true);
  };

  // Handle editing
  const handleEdit = () => {
    navigate(`/recipes/edit/${recipe.id}`);
    toast({
      title: "Edit mode",
      description: "Now editing your recipe"
    });
  };

  // Handle deletion with confirmation
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteRecipe(recipe.id, {
      onSuccess: () => {
        toast({
          title: "Recipe deleted",
          description: "Your recipe has been moved to trash"
        });
        navigate('/recipes');
      }
    });
  };

  return (
    <div className="space-y-6 py-4">
      <h2 className="text-2xl font-semibold mb-4">Recipe Utilities</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Print Recipe Card */}
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium">Print Recipe</h3>
              <p className="text-muted-foreground text-sm mt-1">Create a printer-friendly version</p>
            </div>
            <Printer className="h-6 w-6 text-muted-foreground" />
          </div>
          <Button 
            onClick={handlePrint} 
            className="w-full mt-2"
            variant="outline"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print Recipe
          </Button>
          {/* Hidden print dialog trigger */}
          <PrintRecipe recipe={recipe} ref={printRecipeRef} />
        </div>

        {/* Share Recipe Card */}
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium">Share Recipe</h3>
              <p className="text-muted-foreground text-sm mt-1">Share with friends and family</p>
            </div>
            <Share2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <Button 
            onClick={handleShare} 
            className="w-full mt-2"
            variant="outline"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share Recipe
          </Button>
          {/* Share dialog */}
          <ShareRecipeDialog 
            open={showShareDialog} 
            onOpenChange={setShowShareDialog}
            recipe={recipe}
          />
        </div>

        {/* Edit Recipe Card */}
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium">Edit Recipe</h3>
              <p className="text-muted-foreground text-sm mt-1">Make changes to your recipe</p>
            </div>
            <Edit className="h-6 w-6 text-muted-foreground" />
          </div>
          <Button 
            onClick={handleEdit} 
            className="w-full mt-2"
            variant="outline"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Recipe
          </Button>
        </div>

        {/* Delete Recipe Card */}
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium">Delete Recipe</h3>
              <p className="text-muted-foreground text-sm mt-1">Move this recipe to trash</p>
            </div>
            <Trash2 className="h-6 w-6 text-destructive" />
          </div>
          <Button 
            onClick={handleDelete} 
            className="w-full mt-2"
            variant="outline"
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete Recipe"}
          </Button>

          {/* Delete confirmation dialog */}
          <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will move "{recipe.title}" to trash. You can restore it later from the trash.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={confirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
