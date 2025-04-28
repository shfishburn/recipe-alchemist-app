
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import InputsTab from './tabs/InputsTab';
import FormFooter from './form/FormFooter';
import PreviewDialog from './form/PreviewDialog';
import AdvancedOptions from './form/AdvancedOptions';

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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [ingredientInput, setIngredientInput] = useState('');
  
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    cuisine: 'italian',
    dietary: 'no-restrictions',
    flavorTags: [],
    ingredients: [],
    url: '',
    servings: 2,
    maxCalories: 600,
    maxMinutes: 30,
    imageFile: null,
  });

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
    
    if (!formData.title.trim()) {
      toast({
        title: "Missing Recipe Name",
        description: "Please enter a name for your recipe.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData);
    setHasGenerated(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        servings={formData.servings}
        onServingsChange={(value) => setFormData((prev) => ({ ...prev, servings: value }))}
      />

      <AdvancedOptions
        showAdvanced={showAdvanced}
        onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        url={formData.url}
        onUrlChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
        onImageSelected={(file) => setFormData((prev) => ({ ...prev, imageFile: file }))}
        maxCalories={formData.maxCalories}
        maxMinutes={formData.maxMinutes}
        onSettingChange={handleSettingChange}
      />

      <FormFooter
        onPreview={() => setPreviewOpen(true)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        hasGenerated={hasGenerated}
      />

      <PreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        formData={formData}
        showAdvanced={showAdvanced}
      />
    </form>
  );
};

export default RecipeForm;
