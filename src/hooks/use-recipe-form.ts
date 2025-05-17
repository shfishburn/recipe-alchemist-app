
import { useState } from 'react';
import { RecipeFormData } from '@/components/recipe-builder/RecipeForm';

export const useRecipeForm = (
  onSubmit: (data: RecipeFormData) => void,
  isLoading = false
) => {
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' or 'advanced'
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [ingredientInput, setIngredientInput] = useState('');
  
  // Form data state
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    cuisine: '',
    dietary: '',
    flavorTags: [],
    ingredients: [],
    url: '',
    servings: 2,
    maxCalories: 0,
    imageFile: null
  });
  
  const handleAddIngredient = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && ingredientInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredientInput.trim()]
      }));
      setIngredientInput('');
    }
  };
  
  const handleRemoveIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };
  
  const handleSettingChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
  };
};
