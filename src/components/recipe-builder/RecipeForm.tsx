
import React, { useState } from 'react';
import InputsTab from './tabs/InputsTab';
import FormFooter from './form/FormFooter';
import PreviewDialog from './form/PreviewDialog';
import LoadingInterstitial from './LoadingInterstitial';
import AdvancedOptions from './form/AdvancedOptions';
import { useRecipeForm } from '@/hooks/use-recipe-form';
import { toast } from '@/hooks/use-toast';

export interface RecipeFormData {
  title: string;
  cuisine: string;
  dietary: string;
  flavorTags: string[];
  ingredients: string[];
  url: string;
  servings: number;
  maxCalories: number;
  imageFile: File | null;
}

interface RecipeFormProps {
  onSubmit: (formData: RecipeFormData) => void;
  isLoading?: boolean;
  error?: string | null;
}

const RecipeForm = ({ onSubmit, isLoading = false, error = null }: RecipeFormProps) => {
  const [isRetrying, setIsRetrying] = useState(false);
  
  const {
    formState: {
      activeTab,
      showAdvanced,
      previewOpen,
      hasGenerated,
      ingredientInput,
      formData,
    },
    actions: {
      setActiveTab,
      setShowAdvanced,
      setPreviewOpen,
      setIngredientInput,
      setFormData,
      handleAddIngredient,
      handleRemoveIngredient,
      handleSettingChange,
      handleSubmit,
    },
  } = useRecipeForm(onSubmit, isLoading);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };
  
  const handleRetry = () => {
    setIsRetrying(true);
    toast({
      title: "Retrying recipe generation",
      description: "We're attempting to generate your recipe again...",
    });
    
    // Re-submit the form with the same data
    onSubmit(formData);
    
    // Reset retry state after a short delay
    setTimeout(() => {
      setIsRetrying(false);
    }, 500);
  };

  return (
    <form onSubmit={onFormSubmit} className="space-y-6">
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
        onSettingChange={handleSettingChange}
      />

      <FormFooter
        onPreview={() => setPreviewOpen(true)}
        onSubmit={onFormSubmit}
        isLoading={isLoading || isRetrying}
        hasGenerated={hasGenerated}
      />

      <PreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        formData={formData}
        showAdvanced={showAdvanced}
      />

      <LoadingInterstitial 
        isOpen={isLoading || isRetrying} 
        onCancel={() => {
          // This will be passed from parent component
        }}
        onRetry={handleRetry}
        error={error}
      />
    </form>
  );
};

export default RecipeForm;
