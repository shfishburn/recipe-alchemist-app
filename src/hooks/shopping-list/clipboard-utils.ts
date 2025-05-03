
import { ShoppingListItem, ShoppingList } from '@/types/shopping-list';
import { useToast } from '@/hooks/use-toast';
import { groupItemsByDepartment } from './item-organization';

export function useClipboard() {
  const { toast } = useToast();

  const copyToClipboard = (list: ShoppingList, itemsByDepartment: Record<string, ShoppingListItem[]>) => {
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

  return { copyToClipboard };
}
