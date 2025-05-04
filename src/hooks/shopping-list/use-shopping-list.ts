
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useClipboard } from './clipboard-utils';
import { organizeItems } from './item-organization';
import { toggleItem, deleteItem, addItem } from './item-utils';
import type { ShoppingList, ShoppingListItem } from '@/types/shopping-list';

export const useShoppingList = (list: ShoppingList, onUpdate: () => void) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'dept'>('dept');
  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>({});
  const { copyToClipboard } = useClipboard();
  
  // Get all departments from list items
  const allDepartments = Array.from(
    new Set([
      ...list.items.map(item => item.department || 'Other'),
      'Produce', 'Dairy', 'Meat', 'Bakery', 'Frozen', 'Pantry', 'Other'
    ])
  ).sort();
  
  // Organize items based on search and sort criteria
  const itemsByDepartment = organizeItems(list.items, searchTerm, sortOrder);
  
  // Filter out "water" items
  const filteredItemsByDepartment = Object.entries(itemsByDepartment).reduce((acc, [dept, items]) => {
    const filteredItems = items.filter(item => 
      !item.name.toLowerCase().trim().match(/^water$/)
    );
    
    if (filteredItems.length > 0) {
      acc[dept] = filteredItems;
    }
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);
  
  const groupedItems = filteredItemsByDepartment;
  
  // Helper function to save the updated list
  const saveList = async (updatedItems: ShoppingListItem[]): Promise<boolean> => {
    try {
      const updatedList = {
        ...list,
        items: updatedItems,
        updated_at: new Date().toISOString()
      };
      
      // Call the parent component's update function
      onUpdate();
      return true;
    } catch (error) {
      console.error('Error saving list:', error);
      toast.error('Failed to save changes');
      return false;
    }
  };
  
  // Toggle item checked state
  const handleToggleItem = async (index: number) => {
    await toggleItem(index, list.items, saveList);
  };
  
  // Delete item from the list
  const handleDeleteItem = async (index: number) => {
    await deleteItem(index, list.items, saveList);
  };
  
  // Add a new item to the list
  const handleAddItem = async (newItem: Partial<ShoppingListItem>) => {
    return await addItem(newItem, list.items, saveList);
  };
  
  // Toggle department expansion
  const toggleDeptExpanded = useCallback((dept: string) => {
    setExpandedDepts(prev => ({
      ...prev,
      [dept]: !prev[dept]
    }));
  }, []);
  
  // Get the index of an item
  const getItemIndex = useCallback(
    (item: ShoppingListItem) => {
      return list.items.findIndex(
        i => i.name === item.name && i.department === item.department
      );
    },
    [list.items]
  );
  
  // Toggle all items in a department
  const toggleAllInDepartment = async (department: string, checked: boolean) => {
    try {
      // Find all items in this department
      const deptItems = list.items.filter(item => item.department === department);
      
      if (deptItems.length === 0) {
        return false;
      }
      
      // Create a new array with updated checked states
      const updatedItems = list.items.map(item =>
        item.department === department ? { ...item, checked } : item
      );
      
      // Save the updated list
      const success = await saveList(updatedItems);
      
      if (success) {
        toast.success(`${checked ? 'Completed' : 'Uncompleted'} all items in ${department}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error toggling department:', error);
      toast.error('Failed to update items');
      return false;
    }
  };
  
  // Copy the shopping list to clipboard
  const handleCopyToClipboard = async (): Promise<boolean> => {
    try {
      await copyToClipboard(list, itemsByDepartment);
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy to clipboard');
      return false;
    }
  };
  
  // Init: Expand all departments by default
  useEffect(() => {
    // Get all departments in the current view
    const depts = Object.keys(groupedItems);
    
    // Create an object with all departments expanded
    const initialExpandedState = depts.reduce((acc, dept) => {
      acc[dept] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    // Set the initial state
    setExpandedDepts(initialExpandedState);
  }, []);
  
  return {
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    groupedItems,
    expandedDepts,
    toggleDeptExpanded,
    handleToggleItem,
    handleDeleteItem,
    handleAddItem,
    toggleAllInDepartment,
    copyToClipboard: handleCopyToClipboard,
    allDepartments,
    itemsByDepartment,
    getItemIndex
  };
};
