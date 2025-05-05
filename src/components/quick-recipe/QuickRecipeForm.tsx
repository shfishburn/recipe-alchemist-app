
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CookingPot, Plus, Save } from 'lucide-react';
import { QuickRecipeFormData, QuickRecipe } from '@/types/quick-recipe';
import { useToast } from '@/hooks/use-toast';
import { useQuickRecipeSave } from '@/components/quick-recipe/QuickRecipeSave';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ServingsSelector } from './form-components/ServingsSelector';
import { CuisineSelector } from './form-components/CuisineSelector';
import { DietarySelector } from './form-components/DietarySelector';

export function QuickRecipeForm({ onSubmit, isLoading }: { 
  onSubmit: (data: QuickRecipeFormData) => void;
  isLoading: boolean;
}) {
  const [recipe, setRecipe] = useState<QuickRecipe>({
    title: '',
    description: '',
    ingredients: [],
    steps: [],
    servings: 2,
    cuisine: 'any',
    dietary: ''
  });
  const [newIngredient, setNewIngredient] = useState('');
  const [newStep, setNewStep] = useState('');
  const { toast } = useToast();
  const { saveRecipe, isSaving } = useQuickRecipeSave();

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setRecipe(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, { 
          item: newIngredient.trim(),
          qty: 1,
          unit: ''
        }]
      }));
      setNewIngredient('');
    }
  };

  const handleAddStep = () => {
    if (newStep.trim()) {
      setRecipe(prev => ({
        ...prev,
        steps: [...prev.steps, newStep.trim()]
      }));
      setNewStep('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveStep = (index: number) => {
    setRecipe(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const handleCuisineChange = (value: string) => {
    setRecipe(prev => ({
      ...prev,
      cuisine: value
    }));
  };

  const handleDietaryChange = (value: string) => {
    setRecipe(prev => ({
      ...prev,
      dietary: value
    }));
  };

  const handleServingsChange = (value: number) => {
    setRecipe(prev => ({
      ...prev,
      servings: value
    }));
  };

  const handleSaveRecipe = async () => {
    if (!recipe.title) {
      toast({
        title: "Missing recipe title",
        description: "Please provide a title for your recipe",
        variant: "destructive",
      });
      return;
    }

    if (recipe.ingredients.length === 0) {
      toast({
        title: "Missing ingredients",
        description: "Please add at least one ingredient",
        variant: "destructive",
      });
      return;
    }

    if (recipe.steps.length === 0) {
      toast({
        title: "Missing steps",
        description: "Please add at least one cooking step",
        variant: "destructive",
      });
      return;
    }

    try {
      await saveRecipe(recipe);
    } catch (error: any) {
      toast({
        title: "Failed to save recipe",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-5 space-y-5 bg-white shadow-md rounded-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-center">Create Your Own Recipe</h2>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="title">Recipe Title</Label>
          <Input 
            id="title"
            placeholder="Enter recipe title" 
            value={recipe.title}
            onChange={(e) => setRecipe(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description"
            placeholder="Brief description of your recipe" 
            value={recipe.description || ''}
            onChange={(e) => setRecipe(prev => ({ ...prev, description: e.target.value }))}
            className="min-h-[80px]"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Ingredients</Label>
        <div className="flex space-x-2">
          <Input 
            placeholder="Add an ingredient" 
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
          />
          <Button type="button" onClick={handleAddIngredient}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        
        <ul className="list-disc pl-5 space-y-1">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{ingredient.item}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleRemoveIngredient(index)}
                className="h-6 px-2 text-red-500 hover:text-red-700"
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="space-y-3">
        <Label>Cooking Steps</Label>
        <div className="flex space-x-2">
          <Textarea 
            placeholder="Add a cooking step" 
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
            className="min-h-[80px]"
          />
          <Button type="button" onClick={handleAddStep} className="h-10">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        
        <ol className="list-decimal pl-5 space-y-2">
          {recipe.steps.map((step, index) => (
            <li key={index} className="flex justify-between items-start">
              <span>{step}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleRemoveStep(index)}
                className="h-6 px-2 text-red-500 hover:text-red-700"
              >
                Remove
              </Button>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="servings">Servings</Label>
          <ServingsSelector 
            selectedServings={recipe.servings} 
            onServingsChange={handleServingsChange} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cuisine">Cuisine</Label>
          <CuisineSelector 
            value={recipe.cuisine} 
            onChange={handleCuisineChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dietary">Dietary</Label>
          <DietarySelector
            value={recipe.dietary}
            onChange={handleDietaryChange}
          />
        </div>
      </div>
      
      <div className="pt-4 space-x-3 flex justify-center">
        <Button 
          type="button" 
          onClick={handleSaveRecipe} 
          className="bg-recipe-green hover:bg-recipe-green/90"
          disabled={isSaving}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Recipe'}
        </Button>
      </div>
    </Card>
  );
}
