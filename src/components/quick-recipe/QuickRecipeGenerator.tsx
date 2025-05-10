
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ChefHat } from 'lucide-react';
import { useQuickRecipeForm } from '@/hooks/use-quick-recipe-form';
import { toast } from '@/hooks/use-toast';
import { QuickRecipeFormData } from '@/types/quick-recipe';

export function QuickRecipeGenerator() {
  const [mainIngredient, setMainIngredient] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleSubmit } = useQuickRecipeForm();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mainIngredient.trim()) {
      toast({
        title: 'Please enter an ingredient',
        description: 'Tell us what you have in your kitchen',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create form data with default values for other fields
      const formData: QuickRecipeFormData = {
        mainIngredient: mainIngredient.trim(),
        cuisine: 'any',
        dietary: '',
        servings: 2
      };

      // Submit the form data
      await handleSubmit(formData);
      
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast({
        title: 'Something went wrong',
        description: 'Failed to generate recipe. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="ingredient-input" className="text-sm font-medium text-muted-foreground mb-1 block">
            What ingredients do you have?
          </label>
          <Input
            id="ingredient-input"
            placeholder="e.g. chicken, rice, spinach"
            value={mainIngredient}
            onChange={(e) => setMainIngredient(e.target.value)}
            className="w-full mobile-friendly-input"
            disabled={isSubmitting}
            autoComplete="off"
          />
        </div>
        <div className="flex items-end">
          <Button 
            type="submit" 
            size="lg"
            disabled={isSubmitting || !mainIngredient.trim()}
            className="w-full md:w-auto bg-recipe-green hover:bg-recipe-green/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <ChefHat className="mr-2 h-4 w-4" />
                Create Recipe
              </>
            )}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Tell us what ingredients you have, and we'll create a personalized recipe
      </p>
    </form>
  );
}
