
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { RecipeFormData } from '../RecipeForm';

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: RecipeFormData;
  showAdvanced: boolean;
}

const PreviewDialog = ({ open, onOpenChange, formData, showAdvanced }: PreviewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Recipe Selections</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <h4 className="text-sm font-medium">Title</h4>
            <p className="text-sm text-muted-foreground">
              {formData.title || "AI will suggest a title"}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium">Cuisine</h4>
            <p className="text-sm text-muted-foreground capitalize">
              {formData.cuisine}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium">Dietary Preference</h4>
            <p className="text-sm text-muted-foreground capitalize">
              {formData.dietary.replace(/-/g, ' ')}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium">Flavor Tags</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {formData.flavorTags.length > 0 ? (
                formData.flavorTags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="capitalize">
                    {tag}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No flavor tags selected</p>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium">Main Ingredients</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {formData.ingredients.length > 0 ? (
                formData.ingredients.map((ingredient, i) => (
                  <Badge key={i} variant="outline">
                    {ingredient}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No ingredients added</p>
              )}
            </div>
          </div>
          
          {showAdvanced && (
            <>
              <div>
                <h4 className="text-sm font-medium">Servings</h4>
                <p className="text-sm text-muted-foreground">{formData.servings}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Max Calories</h4>
                <p className="text-sm text-muted-foreground">{formData.maxCalories} per serving</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
