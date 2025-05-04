
import { toast } from '@/hooks/use-toast';
import type { ShoppingList, ShoppingListItem } from '@/types/shopping-list';
import { capitalizeName } from './item-organization';

/**
 * Format and copy shopping list to clipboard
 */
export const useClipboard = () => {
  /**
   * Format shopping list as text for clipboard
   */
  const formatShoppingListForClipboard = (
    itemsByDepartment: Record<string, ShoppingListItem[]>,
    list: ShoppingList
  ): string => {
    // Format list by departments
    const textByDepartments = Object.entries(itemsByDepartment)
      .map(([department, items]) => {
        const itemTexts = items
          // Filter out any "water" items
          .filter(item => !item.name.toLowerCase().trim().match(/^water$/))
          .map(item => {
            // Format each item with capitalized name
            const name = capitalizeName(item.name);
            const quantityUnit = item.quantity && item.unit
              ? `${item.quantity} ${item.unit} `
              : '';
            const notes = item.notes
              ? ` (${item.notes})`
              : '';
              
            return `- ${quantityUnit}${name}${notes}`;
          });
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
    
    return fullText;
  };

  /**
   * Copy shopping list to clipboard
   */
  const copyToClipboard = async (
    list: ShoppingList,
    itemsByDepartment: Record<string, ShoppingListItem[]>
  ) => {
    try {
      const text = formatShoppingListForClipboard(itemsByDepartment, list);
      
      await navigator.clipboard.writeText(text);
      
      toast({
        title: "Copied to clipboard",
        description: "Shopping list copied to clipboard"
      });
      
      return true;
    } catch (err) {
      console.error('Failed to copy: ', err);
      
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
      
      return false;
    }
  };
  
  return { copyToClipboard };
};
