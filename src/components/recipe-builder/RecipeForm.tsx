
import React from 'react';
import InputsTab from './tabs/InputsTab';
import FormFooter from './form/FormFooter';
import PreviewDialog from './form/PreviewDialog';
import AdvancedOptions from './form/AdvancedOptions';
import { useRecipeForm } from '@/hooks/use-recipe-form';

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
    handleSubmit(e);
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
        maxMinutes={formData.maxMinutes}
        onSettingChange={handleSettingChange}
      />

      <FormFooter
        onPreview={() => setPreviewOpen(true)}
        onSubmit={onFormSubmit}
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
