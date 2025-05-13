
import { useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ShoppingList, ShoppingListItem } from '@/types/shopping-list';
import { organizeItems, groupItemsByDepartment } from './item-organization';
import { toggleItem, deleteItem, addItem } from './item-utils';

/**
 * Hook for managing a shopping list's items, filtering, sorting and UI state
 */
export function useShoppingList(list: ShoppingList, onUpdate: () => void) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'dept'>('dept');
  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>({});
  const [items, setItems] = useState<ShoppingListItem[]>(list.items);

  // Update local state when list changes from props
  useCallback(() => {
    setItems(list.items);
  }, [list]);

  // Group items by department
  const itemsByDepartment = useMemo(() => {
    return groupItemsByDepartment(items);
  }, [items]);

  // Get all departments
  const allDepartments = useMemo(() => {
    return Object.keys(itemsByDepartment);
  }, [itemsByDepartment]);
  
  // Initialize expanded departments state if not done
  useCallback(() => {
    const initial: Record<string, boolean> = {};
    allDepartments.forEach(dept => {
      // By default all departments are expanded
      initial[dept] = true;
    });
    setExpandedDepts(prev => ({...initial, ...prev}));
  }, [allDepartments]);

  // Organize items by search term and sort order
  const groupedItems = useMemo(() => {
    return organizeItems(items, searchTerm, sortOrder);
  }, [items, searchTerm, sortOrder]);

  // Handler functions
  const handleToggleItem = async (index: number) => {
    return toggleItem(index, items, async (updatedItems) => {
      setItems(updatedItems);
      
      // Then send the update to the server
      const { error } = await supabase
        .from('shopping_lists')
        .update({ items: updatedItems })
        .eq('id', list.id);

      if (error) {
        // If there's an error, revert the optimistic update
        setItems(list.items);
        toast.error('Failed to update item');
        return false;
      } else {
        // Only call onUpdate after successful DB update
        onUpdate();
        return true;
      }
    });
  };

  const handleDeleteItem = async (index: number) => {
    return deleteItem(index, items, async (updatedItems) => {
      setItems(updatedItems);
      
      const { error } = await supabase
        .from('shopping_lists')
        .update({ items: updatedItems })
        .eq('id', list.id);

      if (error) {
        // Revert on error
        setItems(list.items);
        toast.error('Failed to delete item');
        return false;
      } else {
        onUpdate();
        return true;
      }
    });
  };
  
  const handleAddItem = async (newItem: Partial<ShoppingListItem>) => {
    return addItem(newItem, items, async (updatedItems) => {
      setItems(updatedItems);
      
      const { error } = await supabase
        .from('shopping_lists')
        .update({ items: updatedItems })
        .eq('id', list.id);
        
      if (error) {
        // Revert on error
        setItems(list.items);
        toast.error('Failed to add item');
        return false;
      } else {
        onUpdate();
        return true;
      }
    });
  };
  
  const toggleAllInDepartment = async (department: string, checked: boolean) => {
    // Optimistically update local state
    const updatedItems = items.map(item => 
      item.department === department ? {...item, checked} : item
    );
    
    setItems(updatedItems);
    
    const { error } = await supabase
      .from('shopping_lists')
      .update({ items: updatedItems })
      .eq('id', list.id);
      
    if (error) {
      // Revert on error
      setItems(list.items);
      toast.error('Failed to update items');
      return false;
    } else {
      onUpdate();
      return true;
    }
  };
  
  const toggleDeptExpanded = (dept: string) => {
    setExpandedDepts(prev => ({
      ...prev,
      [dept]: !prev[dept]
    }));
  };
  
  const copyToClipboard = async () => {
    // Format list by departments
    const textByDepartments = Object.entries(itemsByDepartment)
      .map(([department, deptItems]) => {
        const itemTexts = deptItems.map(item => 
          `${item.checked ? '[x]' : '[ ]'} ${item.quantity} ${item.unit} ${item.name}${item.notes ? ` (${item.notes})` : ''}`
        );
        return `## ${department}\n${itemTexts.join('\n')}`;
      }).join('\n\n');
      
    // Add tips and preparation notes if available
    let fullText = textByDepartments;
    
    if (list.tips && list.tips.length > 0) {
      fullText += '\n\n## Shopping Tips\n';
      fullText += list.tips.map(tip => `- ${tip}`).join('\n');
    }
    
    if (list.preparation_notes && list.preparation_notes.length > 0) {
      fullText += '\n\n## Preparation Notes\n';
      fullText += list.preparation_notes.map(note => `- ${note}`).join('\n');
    }
    
    return navigator.clipboard.writeText(fullText)
      .then(() => {
        toast.success("Copied to clipboard");
        return true;
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast.error("Could not copy to clipboard");
        return false;
      });
  };

  const getItemIndex = (item: ShoppingListItem) => {
    return items.findIndex(
      i => i.name === item.name && i.unit === item.unit && i.department === item.department
    );
  };

  return {
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    expandedDepts,
    filteredItems: items.filter(item => 
      searchTerm.trim() === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    sortedItems: [...items].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === 'desc') {
        return b.name.localeCompare(a.name);
      } 
      return 0;
    }),
    groupedItems,
    allDepartments,
    itemsByDepartment,
    handleToggleItem,
    handleDeleteItem,
    handleAddItem,
    toggleAllInDepartment,
    toggleDeptExpanded,
    copyToClipboard,
    getItemIndex
  };
}
