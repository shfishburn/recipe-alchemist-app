
import { useToast } from '@/hooks/use-toast';
import { ShoppingList, ShoppingListItem } from '@/types/shopping-list';

export function useClipboard() {
  const { toast } = useToast();
  
  // Format shopping list for clipboard
  const formatShoppingList = (
    list: ShoppingList,
    itemsByDepartment: Record<string, ShoppingListItem[]>
  ): string => {
    // List title
    let formattedText = `# ${list.title}\n\n`;
    
    // Format items by department
    Object.entries(itemsByDepartment).forEach(([department, items]) => {
      formattedText += `## ${department}\n`;
      items.forEach(item => {
        // Use shop size quantities when available
        const displayQuantity = item.shop_size_qty 
          ? `${item.shop_size_qty} ${item.shop_size_unit || ''}`.trim()
          : `${item.quantity} ${item.unit || ''}`.trim();
          
        formattedText += `- [${item.checked ? 'x' : ' '}] ${displayQuantity} ${item.name}${item.notes ? ` (${item.notes})` : ''}\n`;
      });
      formattedText += '\n';
    });
    
    // Add tips and notes
    if (list.tips && list.tips.length > 0) {
      formattedText += '## Shopping Tips\n';
      list.tips.forEach(tip => {
        formattedText += `- ${tip}\n`;
      });
      formattedText += '\n';
    }
    
    if (list.preparation_notes && list.preparation_notes.length > 0) {
      formattedText += '## Preparation Notes\n';
      list.preparation_notes.forEach(note => {
        formattedText += `- ${note}\n`;
      });
      formattedText += '\n';
    }
    
    return formattedText;
  };
  
  // Copy formatted list to clipboard
  const copyToClipboard = async (
    list: ShoppingList,
    itemsByDepartment: Record<string, ShoppingListItem[]>
  ) => {
    try {
      const formattedText = formatShoppingList(list, itemsByDepartment);
      await navigator.clipboard.writeText(formattedText);
      
      toast({
        title: 'Copied to clipboard',
        description: 'Shopping list has been copied to your clipboard',
      });
      
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      
      toast({
        title: 'Copy failed',
        description: 'Could not copy list to clipboard',
        variant: 'destructive',
      });
      
      return false;
    }
  };
  
  return { copyToClipboard };
}
