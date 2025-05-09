
import React from 'react';
import { QuickRecipeFormContainer } from '../QuickRecipeFormContainer';

export function QuickRecipeEmpty() {
  return (
    <div className="animate-fadeIn" data-testid="quick-recipe-empty">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-muted-foreground">
            Start by entering your ingredients and preferences below
          </p>
        </div>
        
        <div className="mx-auto mb-8 max-w-xl lg:max-w-2xl">
          <QuickRecipeFormContainer />
        </div>
      </div>
    </div>
  );
}

export default QuickRecipeEmpty;
