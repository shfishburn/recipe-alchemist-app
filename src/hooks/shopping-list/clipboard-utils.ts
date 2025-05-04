
import { useToast } from '@/hooks/use-toast';
import type { ShoppingList, ShoppingListItem } from '@/types/shopping-list';

// Format shopping list for clipboard
export function formatListForClipboard(
  list: ShoppingList, 
  itemsByDepartment: Record<string, ShoppingListItem[]>
): string {
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
  
  return fullText;
}

export function useClipboard() {
  const { toast } = useToast();
  
  const copyToClipboard = (
    list: ShoppingList,
    itemsByDepartment: Record<string, ShoppingListItem[]>
  ): Promise<boolean> => {
    const formattedText = formatListForClipboard(list, itemsByDepartment);
    
    return navigator.clipboard.writeText(formattedText)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Shopping list copied to clipboard"
        });
        return true;
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard",
          variant: "destructive"
        });
        return false;
      });
  };
  
  return { copyToClipboard };
}
