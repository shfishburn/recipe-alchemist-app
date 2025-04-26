
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InputsTab from './tabs/InputsTab';
import MediaTab from './tabs/MediaTab';
import SettingsTab from './tabs/SettingsTab';

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

interface RecipeFormProps {
  onSubmit: (formData: RecipeFormData) => void;
  isLoading?: boolean;
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

  const handleSettingChange = (field: string, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        
        <TabsContent value="inputs">
          <InputsTab
            title={formData.title}
            cuisine={formData.cuisine}
            dietary={formData.dietary}
            flavorTags={formData.flavorTags}
            ingredients={formData.ingredients}
            ingredientInput={ingredientInput}
            onTitleChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            onCuisineChange={(value) => setFormData((prev) => ({ ...prev, cuisine: value }))}
            onDietaryChange={(value) => setFormData((prev) => ({ ...prev, dietary: value }))}
            onFlavorTagsChange={(tags) => setFormData((prev) => ({ ...prev, flavorTags: tags }))}
            onIngredientChange={setIngredientInput}
            onIngredientKeyDown={handleAddIngredient}
            onRemoveIngredient={handleRemoveIngredient}
          />
        </TabsContent>

        <TabsContent value="url">
          <MediaTab
            url={formData.url}
            onUrlChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
            onImageSelected={(file) => setFormData((prev) => ({ ...prev, imageFile: file }))}
          />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab
            servings={formData.servings}
            maxCalories={formData.maxCalories}
            maxMinutes={formData.maxMinutes}
            onChange={handleSettingChange}
          />
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
