
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, X } from 'lucide-react';
import CuisineSelect from './CuisineSelect';
import DietarySelect from './DietarySelect';
import FlavorTagsInput from './FlavorTagsInput';
import ImageDropzone from './ImageDropzone';

interface RecipeFormProps {
  onSubmit: (formData: RecipeFormData) => void;
  isLoading?: boolean;
}

export interface RecipeFormData {
  title: string;
  cuisine: string;
  dietary: string;
  flavorTags: string[];
  ingredients: string[];
  url: string;
  servings: number;
  maxCalories: number;
  maxMinutes: number;
  imageFile: File | null;
}

const RecipeForm = ({ onSubmit, isLoading = false }: RecipeFormProps) => {
  const [activeTab, setActiveTab] = useState('inputs');
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    cuisine: '',
    dietary: '',
    flavorTags: [],
    ingredients: [],
    url: '',
    servings: 2,
    maxCalories: 600,
    maxMinutes: 30,
    imageFile: null,
  });

  const [ingredientInput, setIngredientInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddIngredient = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && ingredientInput.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredientInput.trim()],
      }));
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleImageSelected = (file: File) => {
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="inputs" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inputs">Recipe Inputs</TabsTrigger>
          <TabsTrigger value="url">URL / Image</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inputs" className="space-y-4 pt-4">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Recipe Title (Optional)</Label>
            <Input
              id="title"
              name="title"
              placeholder="Leave blank for AI to suggest a title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          {/* Cuisine Selector */}
          <CuisineSelect
            value={formData.cuisine}
            onChange={(value) => setFormData((prev) => ({ ...prev, cuisine: value }))}
          />

          {/* Dietary Preference */}
          <DietarySelect
            value={formData.dietary}
            onChange={(value) => setFormData((prev) => ({ ...prev, dietary: value }))}
          />

          {/* Flavor Tags */}
          <FlavorTagsInput
            tags={formData.flavorTags}
            onChange={(tags) => setFormData((prev) => ({ ...prev, flavorTags: tags }))}
          />

          {/* Ingredients List */}
          <div className="space-y-2">
            <Label htmlFor="ingredients">Main Ingredients</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.ingredients.map((ingredient, index) => (
                <div 
                  key={index}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-1 text-sm"
                >
                  {ingredient}
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <Input
              id="ingredients"
              placeholder="Type ingredient and press Enter"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyDown={handleAddIngredient}
            />
            <p className="text-xs text-muted-foreground">Press Enter to add each ingredient</p>
          </div>
        </TabsContent>

        <TabsContent value="url" className="space-y-6 pt-4">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="url">Recipe URL (Optional)</Label>
            <Input
              id="url"
              name="url"
              placeholder="Enter a link to a recipe to adapt it"
              value={formData.url}
              onChange={handleInputChange}
            />
          </div>

          {/* Image Upload */}
          <ImageDropzone onImageSelected={handleImageSelected} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 pt-4">
          {/* Servings */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="servings">Number of Servings</Label>
              <span className="text-sm text-muted-foreground">{formData.servings}</span>
            </div>
            <Slider
              id="servings"
              min={1}
              max={12}
              step={1}
              value={[formData.servings]}
              onValueChange={(values) => setFormData((prev) => ({ ...prev, servings: values[0] }))}
              className="py-4"
            />
          </div>

          {/* Max Calories */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="calories">Max Calories per Serving</Label>
              <span className="text-sm text-muted-foreground">{formData.maxCalories} kcal</span>
            </div>
            <Slider
              id="calories"
              min={200}
              max={1200}
              step={50}
              value={[formData.maxCalories]}
              onValueChange={(values) => setFormData((prev) => ({ ...prev, maxCalories: values[0] }))}
              className="py-4"
            />
          </div>

          {/* Max Time */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="time">Max Total Time</Label>
              <span className="text-sm text-muted-foreground">{formData.maxMinutes} minutes</span>
            </div>
            <Slider
              id="time"
              min={10}
              max={120}
              step={5}
              value={[formData.maxMinutes]}
              onValueChange={(values) => setFormData((prev) => ({ ...prev, maxMinutes: values[0] }))}
              className="py-4"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-recipe-blue hover:bg-recipe-blue/90 w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Recipe...
            </>
          ) : (
            'Generate Recipe'
          )}
        </Button>
      </div>
    </form>
  );
};

export default RecipeForm;
