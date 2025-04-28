
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { RecipeFormData } from '@/components/recipe-builder/RecipeForm';

export const useRecipeForm = (onSubmit: (formData: RecipeFormData) => void, isLoading = false) => {
  const [activeTab, setActiveTab] = useState('inputs');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [ingredientInput, setIngredientInput] = useState('');
  const { toast } = useToast();
  
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

  return {
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
    isLoading,
  };
};
