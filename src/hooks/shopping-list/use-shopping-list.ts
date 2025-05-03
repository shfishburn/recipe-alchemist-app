
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { ShoppingList, ShoppingListItem } from '@/types/shopping-list';

import { 
  getItemIndex,
  toggleItemChecked, 
  deleteItem, 
  addItem, 
  toggleDepartmentItems 
} from './item-utils';

import { 
  organizeItems, 
  groupItemsByDepartment 
} from './item-organization';

import { useClipboard } from './clipboard-utils';

export function useShoppingList(list: ShoppingList, onUpdate: () => void) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'dept'>('dept');
  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>({});
  const [items, setItems] = useState<ShoppingListItem[]>(list.items);
  const { copyToClipboard } = useClipboard();

  // Update local state when list changes from props
  useEffect(() => {
    setItems(list.items);
  }, [list]);

  // Group items by department
  const itemsByDepartment = groupItemsByDepartment(items);

  // Get all departments
  const allDepartments = Object.keys(itemsByDepartment);
  
  // Initialize expanded departments state if not done
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    allDepartments.forEach(dept => {
      // By default all departments are expanded
      initial[dept] = true;
    });
    setExpandedDepts(prev => ({...initial, ...prev}));
  }, [allDepartments]);

  // Filter and sort items
  const filteredItems = searchTerm.trim() === '' 
    ? items 
    : items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Sort items according to the selected sort order
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === 'desc') {
      return b.name.localeCompare(a.name);
    } 
    // For 'dept', we'll handle in the rendering
    return 0;
  });

  // Group filtered and sorted items
  const groupedItems = organizeItems(items, searchTerm, sortOrder);

  // Handle toggle item checked state
  const handleToggleItem = async (index: number) => {
    const result = await toggleItemChecked(list.id, items, index, { toast });
    if (result) {
      setItems(result);
      onUpdate();
    }
  };

  // Handle delete item
  const handleDeleteItem = async (index: number) => {
    const result = await deleteItem(list.id, items, index, { toast });
    if (result) {
      setItems(result);
      onUpdate();
    }
  };
  
  // Handle add item
  const handleAddItem = async (newItem: Omit<ShoppingListItem, 'checked'>) => {
    const result = await addItem(list.id, items, newItem, { toast });
    if (result) {
      setItems(result);
      onUpdate();
      return Promise.resolve();
    }
    return Promise.reject(new Error('Failed to add item'));
  };
  
  // Handle toggle all items in department
  const toggleAllInDepartment = async (department: string, checked: boolean) => {
    const result = await toggleDepartmentItems(list.id, items, department, checked, { toast });
    if (result) {
      setItems(result);
      onUpdate();
    }
  };
  
  // Toggle department expanded state
  const toggleDeptExpanded = (dept: string) => {
    setExpandedDepts(prev => ({
      ...prev,
      [dept]: !prev[dept]
    }));
  };
  
  // Handle copy to clipboard
  const handleCopyToClipboard = () => {
    return copyToClipboard(list, itemsByDepartment);
  };

  // Get item index helper
  const getItemIndexInList = (item: ShoppingListItem) => {
    return getItemIndex(items, item);
  };

  return {
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    expandedDepts,
    filteredItems,
    sortedItems,
    groupedItems,
    allDepartments,
    itemsByDepartment,
    handleToggleItem,
    handleDeleteItem,
    handleAddItem,
    toggleAllInDepartment,
    toggleDeptExpanded,
    copyToClipboard: handleCopyToClipboard,
    getItemIndex: getItemIndexInList
  };
}
