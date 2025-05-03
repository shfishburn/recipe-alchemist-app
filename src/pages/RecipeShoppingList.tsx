
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import { RecipeShoppingListView } from '@/components/shopping-list/recipe/RecipeShoppingListView';
import { useRecipeShoppingList } from '@/hooks/use-recipe-shopping-list';
import { ShoppingBag } from 'lucide-react';

const RecipeShoppingList = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  
  const {
    recipe,
    recipeLoading,
    recipeError,
    itemsByDepartment,
    departmentExpanded,
    isLoading,
    toggleItemChecked,
    toggleDepartmentExpanded,
    toggleAllInDepartment,
    copyToClipboard
  } = useRecipeShoppingList(recipeId || '');

  // Redirect to 404 if recipe doesn't exist
  React.useEffect(() => {
    if (!recipeLoading && recipeError) {
      navigate('/not-found', { replace: true });
    }
  }, [recipeLoading, recipeError, navigate]);

  // Get item index in the flattened items array
  const getItemIndex = (item: any) => {
    let index = 0;
    for (const dept of Object.values(itemsByDepartment)) {
      for (const deptItem of dept) {
        if (deptItem === item) {
          return index;
        }
        index++;
      }
    }
    return -1;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-6 md:py-8 pb-16 sm:pb-20">
          {!recipeLoading && recipe ? (
            <RecipeShoppingListView
              recipe={recipe}
              isLoading={isLoading}
              itemsByDepartment={itemsByDepartment}
              departmentExpanded={departmentExpanded}
              onToggleDepartment={toggleDepartmentExpanded}
              onToggleItem={toggleItemChecked}
              onToggleDepartmentItems={toggleAllInDepartment}
              onCopyToClipboard={copyToClipboard}
              getItemIndex={getItemIndex}
            />
          ) : recipeError ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">Recipe Not Found</h2>
              <p className="text-muted-foreground mt-2">
                We couldn't find the recipe you're looking for.
              </p>
            </div>
          ) : (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RecipeShoppingList;
