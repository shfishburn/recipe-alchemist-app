
import React from 'react';
import { QuickRecipeTagForm } from './QuickRecipeTagForm';
import { useQuickRecipeForm } from '@/hooks/use-quick-recipe-form';
import { QuickRecipeFormData } from '@/hooks/use-quick-recipe';

export function QuickRecipeFormContainer() {
  const { handleSubmit, isLoading } = useQuickRecipeForm();
  
  return (
    <div className="w-full">
      <QuickRecipeTagForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
}
