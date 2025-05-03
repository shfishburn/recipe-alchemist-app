
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { ShoppingList, ShoppingListItem } from '@/types/shopping-list';
import type { Json } from '@/integrations/supabase/types';

export function useShoppingList(list: ShoppingList, onUpdate: () => void) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'dept'>('dept');
  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>({});

  // Group items by department
  const itemsByDepartment = list.items.reduce((acc, item) => {
    const dept = item.department || 'Other';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(item);
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);

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
    ? list.items 
    : list.items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

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
  const groupedItems = sortOrder === 'dept' 
    ? itemsByDepartment 
    : {
        'All Items': sortedItems
      };

  const handleToggleItem = async (index: number) => {
    const updatedItems = [...list.items];
    updatedItems[index] = {
      ...updatedItems[index],
      checked: !updatedItems[index].checked
    };

    const { error } = await supabase
      .from('shopping_lists')
      .update({ items: updatedItems as unknown as Json })
      .eq('id', list.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update item',
        variant: 'destructive'
      });
    } else {
      onUpdate();
    }
  };

  const handleDeleteItem = async (index: number) => {
    const updatedItems = list.items.filter((_, i) => i !== index);

    const { error } = await supabase
      .from('shopping_lists')
      .update({ items: updatedItems as unknown as Json })
      .eq('id', list.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive'
      });
    } else {
      onUpdate();
      toast({
        title: 'Success',
        description: 'Item removed from list'
      });
    }
  };
  
  const handleAddItem = async (newItem: Omit<ShoppingListItem, 'checked'>) => {
    const item: ShoppingListItem = {
      ...newItem,
      checked: false
    };
    
    const updatedItems = [...list.items, item];
    
    const { error } = await supabase
      .from('shopping_lists')
      .update({ items: updatedItems as unknown as Json })
      .eq('id', list.id);
      
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item',
        variant: 'destructive'
      });
      return Promise.reject(error);
    } else {
      onUpdate();
      return Promise.resolve();
    }
  };
  
  const toggleAllInDepartment = async (department: string, checked: boolean) => {
    const updatedItems = list.items.map(item => 
      item.department === department ? {...item, checked} : item
    );
    
    const { error } = await supabase
      .from('shopping_lists')
      .update({ items: updatedItems as unknown as Json })
      .eq('id', list.id);
      
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update items',
        variant: 'destructive'
      });
    } else {
      onUpdate();
    }
  };
  
  const toggleDeptExpanded = (dept: string) => {
    setExpandedDepts(prev => ({
      ...prev,
      [dept]: !prev[dept]
    }));
  };
  
  const copyToClipboard = () => {
    // Format list by departments
    const textByDepartments = Object.entries(itemsByDepartment)
      .map(([department, items]) => {
        const itemTexts = items.map(item => 
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

  const getItemIndex = (item: ShoppingListItem) => {
    return list.items.findIndex(
      i => i.name === item.name && i.unit === item.unit && i.department === item.department
    );
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
    copyToClipboard,
    getItemIndex
  };
}
