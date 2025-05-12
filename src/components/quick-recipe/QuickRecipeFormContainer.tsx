
import React from 'react';
import { QuickRecipeForm } from './QuickRecipeForm';

export const QuickRecipeFormContainer: React.FC = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <QuickRecipeForm />
    </div>
  );
};

export default QuickRecipeFormContainer;
