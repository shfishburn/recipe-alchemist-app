
import React from 'react';
import RecipeNameInput from '../form/RecipeNameInput';
import RecipeBasics from '../form/RecipeBasics';
import IngredientsSection from '../form/IngredientsSection';
import FlavorTagsInput from '../FlavorTagsInput';

interface InputsTabProps {
  title: string;
  cuisine: string;
  dietary: string;
  flavorTags: string[];
  ingredients: string[];
  ingredientInput: string;
  servings: number;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCuisineChange: (value: string) => void;
  onDietaryChange: (value: string) => void;
  onFlavorTagsChange: (tags: string[]) => void;
  onIngredientChange: (value: string) => void;
  onIngredientKeyDown: (e: React.KeyboardEvent) => void;
  onRemoveIngredient: (index: number) => void;
  onServingsChange: (value: number) => void;
}

const InputsTab = ({
  title,
  cuisine,
  dietary,
  flavorTags,
  ingredients,
  ingredientInput,
  servings,
  onTitleChange,
  onCuisineChange,
  onDietaryChange,
  onFlavorTagsChange,
  onIngredientChange,
  onIngredientKeyDown,
  onRemoveIngredient,
  onServingsChange,
}: InputsTabProps) => {
  return (
    <div className="space-y-8">
      {/* Recipe Name */}
      <RecipeNameInput
        title={title}
        onTitleChange={onTitleChange}
      />

      {/* Main Ingredients */}
      <IngredientsSection
        ingredients={ingredients}
        ingredientInput={ingredientInput}
        onIngredientChange={onIngredientChange}
        onIngredientKeyDown={onIngredientKeyDown}
        onRemoveIngredient={onRemoveIngredient}
      />

      {/* Flavor Profile */}
      <div className="py-4 space-y-4 border-t border-gray-100 dark:border-gray-800">
        <FlavorTagsInput
          tags={flavorTags}
          onChange={onFlavorTagsChange}
        />
      </div>

      {/* Recipe Basics (Cuisine, Servings, Dietary) */}
      <RecipeBasics
        cuisine={cuisine}
        dietary={dietary}
        servings={servings}
        onCuisineChange={onCuisineChange}
        onDietaryChange={onDietaryChange}
        onServingsChange={onServingsChange}
      />
    </div>
  );
};

export default InputsTab;
