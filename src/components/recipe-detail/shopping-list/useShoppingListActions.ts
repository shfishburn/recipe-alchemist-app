import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import type { Json } from '@/integrations/supabase/types';
import type { ShoppingListItem } from '@/types/shopping-list';

export function useShoppingListActions(recipe: Recipe) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateShoppingList = async () => {
    try {
      const response = await fetch('/api/generate-shopping-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: recipe.ingredients,
          title: recipe.title
        }),
      });

      if (!response.ok) throw new Error('Failed to generate shopping list');
      
      const data = await response.json();
      
      // Convert AI-generated departments into flat list items
      const items: ShoppingListItem[] = [];
      data.departments.forEach(dept => {
        dept.items.forEach(item => {
          items.push({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            checked: false,
            notes: item.notes,
            quality_indicators: item.quality_indicators,
            alternatives: item.alternatives,
            pantry_staple: item.pantry_staple,
            storage_tips: item.storage_tips,
            department: dept.name,
            recipeId: recipe.id,
            // Store original ingredient data if available
            originalIngredient: JSON.stringify(
              recipe.ingredients.find(ing => 
                ing.item && (typeof ing.item === 'string' ? 
                  ing.item.toLowerCase().includes(item.name.toLowerCase()) : 
                  (typeof ing.item.item === 'string' && 
                   ing.item.item.toLowerCase().includes(item.name.toLowerCase()))
                )
              )
            )
          });
        });
      });

      // Add common staple items if they're not already in the list
      const basicItems = [
        'Cooking oil',
        'Salt',
        'Black pepper'
      ];
      
      basicItems.forEach(basicItem => {
        const hasItem = items.some(item => 
          item.name.toLowerCase().includes(basicItem.toLowerCase())
        );
        
        if (!hasItem) {
          items.push({
            name: basicItem,
            quantity: 1,
            unit: '',
            checked: false,
            pantry_staple: true,
            department: 'Pantry',
            recipeId: recipe.id
          });
        }
      });

      return { 
        items, 
        tips: data.efficiency_tips || [], 
        preparation_notes: data.preparation_notes || [] 
      };
    } catch (error) {
      console.error('Error in generateShoppingList:', error);
      throw error;
    }
  };

  const createNewList = async (newListName: string) => {
    try {
      setIsLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error("User not authenticated");
      }
      
      const { items, tips, preparation_notes } = await generateShoppingList();
      
      // Enhance item data with structured information for better shopping experience
      const enhancedItems = items.map(item => {
        // If we have original ingredient data, parse it and extract shop sizes
        if (item.originalIngredient) {
          try {
            const originalData = JSON.parse(item.originalIngredient);
            if (originalData) {
              // Use shop size if available
              if (originalData.shop_size_qty !== undefined || originalData.shop_size_unit) {
                return {
                  ...item,
                  quantity: originalData.shop_size_qty !== undefined ? 
                            originalData.shop_size_qty : item.quantity,
                  unit: originalData.shop_size_unit || item.unit
                };
              }
            }
          } catch (e) {
            console.warn("Failed to parse original ingredient data:", e);
          }
        }
        return item;
      });
      
      const { data, error } = await supabase
        .from('shopping_lists')
        .insert({
          title: newListName,
          user_id: userData.user.id,
          items: enhancedItems as unknown as Json,
          tips: tips,
          preparation_notes: preparation_notes
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Created shopping list "${newListName}" with organized ingredients.`,
      });
      
      return data;
    } catch (error) {
      console.error('Error creating shopping list:', error);
      toast({
        title: "Error",
        description: "Failed to create shopping list.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const addToExistingList = async (selectedListId: string) => {
    try {
      setIsLoading(true);
      
      // Get current list items
      const { data: currentList, error: fetchError } = await supabase
        .from('shopping_lists')
        .select('items, tips, preparation_notes')
        .eq('id', selectedListId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Generate new items with AI
      const { items: newItems, tips: newTips, preparation_notes: newPreparationNotes } = await generateShoppingList();
      
      // Enhance item data with structured information for better shopping experience
      const enhancedNewItems = newItems.map(item => {
        // If we have original ingredient data, parse it and extract shop sizes
        if (item.originalIngredient) {
          try {
            const originalData = JSON.parse(item.originalIngredient);
            if (originalData) {
              // Use shop size if available
              if (originalData.shop_size_qty !== undefined || originalData.shop_size_unit) {
                return {
                  ...item,
                  quantity: originalData.shop_size_qty !== undefined ? 
                            originalData.shop_size_qty : item.quantity,
                  unit: originalData.shop_size_unit || item.unit
                };
              }
            }
          } catch (e) {
            console.warn("Failed to parse original ingredient data:", e);
          }
        }
        return item;
      });
      
      // Combine existing and new items, keeping department organization
      const currentItems = (currentList.items as unknown as ShoppingListItem[]) || [];
      const currentTips = (currentList.tips as string[]) || [];
      const currentPreparationNotes = (currentList.preparation_notes as string[]) || [];
      
      // Smart merge: combine items with same name and unit within departments
      const mergedItems = [...currentItems];
      enhancedNewItems.forEach(newItem => {
        const existingItemIndex = mergedItems.findIndex(item => 
          item.name === newItem.name && 
          item.unit === newItem.unit &&
          item.department === newItem.department
        );
        
        if (existingItemIndex >= 0) {
          mergedItems[existingItemIndex].quantity += newItem.quantity;
        } else {
          mergedItems.push(newItem);
        }
      });
      
      // Update the shopping list
      const { error: updateError } = await supabase
        .from('shopping_lists')
        .update({ 
          items: mergedItems as unknown as Json,
          tips: [...new Set([...currentTips, ...newTips])],
          preparation_notes: [...new Set([...currentPreparationNotes, ...newPreparationNotes])]
        })
        .eq('id', selectedListId);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Success",
        description: `Added ingredients to shopping list.`,
      });
    } catch (error) {
      console.error('Error adding to shopping list:', error);
      toast({
        title: "Error",
        description: "Failed to add ingredients to shopping list.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createNewList,
    addToExistingList
  };
}
