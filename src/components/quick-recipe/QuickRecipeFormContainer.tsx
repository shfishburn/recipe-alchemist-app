
import React from 'react';
import { QuickRecipeForm } from './QuickRecipeForm';
import { useQuickRecipeForm } from '@/hooks/use-quick-recipe-form';
import { QuickRecipeFormData } from '@/types/quick-recipe';

export const QuickRecipeFormContainer: React.FC = () => {
  const { handleSubmit, recipe } = useQuickRecipeForm();
  
  // Form submission handler
  const onSubmit = (formData: QuickRecipeFormData) => {
    handleSubmit(formData);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <QuickRecipeForm onSubmit={onSubmit} isLoading={!!recipe} />
    </div>
  );
};

export default QuickRecipeFormContainer;
