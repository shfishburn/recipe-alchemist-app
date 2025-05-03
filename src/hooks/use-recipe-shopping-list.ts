
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRecipeDetail } from '@/hooks/use-recipe-detail';
import { recipeIngredientsToShoppingItems } from '@/utils/ingredient-shopping-converter';
import type { ShoppingListItem } from '@/types/shopping-list';

export function useRecipeShoppingList(recipeId: string) {
  const { session } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [departmentExpanded, setDepartmentExpanded] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch recipe details
  const { 
    data: recipe, 
    isLoading: recipeLoading, 
    error: recipeError 
  } = useRecipeDetail(recipeId);
  
  // Convert recipe ingredients to shopping items once recipe is loaded
  useEffect(() => {
    if (recipe && !recipeLoading) {
      try {
        console.log("Converting recipe ingredients to shopping items:", recipe.title);
        const shoppingItems = recipeIngredientsToShoppingItems(
          recipe.ingredients,
          recipe.id
        );
        
        setItems(shoppingItems);
        
        // Initialize all departments as expanded
        const departments = shoppingItems.reduce((acc, item) => {
          const dept = item.department || 'Other';
          if (!acc[dept]) acc[dept] = true;
          return acc;
        }, {} as Record<string, boolean>);
        
        setDepartmentExpanded(departments);
        setIsLoading(false);
      } catch (error) {
        console.error("Error converting recipe ingredients:", error);
        toast({
          title: "Error",
          description: "Failed to process recipe ingredients",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    }
  }, [recipe, recipeLoading]);

  // Group items by department
  const itemsByDepartment = items.reduce((acc, item) => {
    const dept = item.department || 'Other';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(item);
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);

  const toggleItemChecked = (index: number) => {
    setItems(prevItems => prevItems.map(
      (item, i) => i === index ? { ...item, checked: !item.checked } : item
    ));
  };

  const toggleDepartmentExpanded = (department: string) => {
    setDepartmentExpanded(prev => ({
      ...prev,
      [department]: !prev[department]
    }));
  };

  const toggleAllInDepartment = (department: string, checked: boolean) => {
    setItems(prevItems => prevItems.map(
      item => item.department === department ? { ...item, checked } : item
    ));
  };

  const copyToClipboard = () => {
    // Format list by departments
    const textByDepartments = Object.entries(itemsByDepartment)
      .map(([department, items]) => {
        const itemTexts = items.map(item => {
          const quantity = typeof item.quantity === 'number' ? 
            (Number.isInteger(item.quantity) ? item.quantity : item.quantity.toFixed(1)) : 
            '';
          const unit = item.unit || '';
          return `${item.checked ? '[x]' : '[ ]'} ${quantity} ${unit} ${item.name}${item.notes ? ` (${item.notes})` : ''}`;
        });
        return `## ${department}\n${itemTexts.join('\n')}`;
      }).join('\n\n');
      
    const fullText = `# Shopping List for ${recipe?.title || 'Recipe'}\n\n${textByDepartments}`;
    
    return navigator.clipboard.writeText(fullText)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Shopping list copied to clipboard"
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard",
          variant: "destructive"
        });
      });
  };

  return {
    recipe,
    recipeLoading,
    recipeError,
    items,
    itemsByDepartment,
    departmentExpanded,
    isLoading,
    toggleItemChecked,
    toggleDepartmentExpanded,
    toggleAllInDepartment,
    copyToClipboard
  };
}
