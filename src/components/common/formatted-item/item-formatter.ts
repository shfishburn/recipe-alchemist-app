
import { formatIngredient } from '@/utils/ingredient-format';
import { 
  FormattableItem, 
  FormattingOptions, 
  isShoppingListItem,
  isQuickShoppingItem,
  isRecipeIngredient
} from './types';

/**
 * Universal formatter that converts any type of item to a formatted string with markdown
 * for highlighting specific parts
 */
export function formatItem(
  item: FormattableItem, 
  options: FormattingOptions = {}
): string {
  // Default options
  const {
    highlight = 'name',
    strikethrough = false,
    unitSystem = 'metric'
  } = options;

  // Early return for string items
  if (typeof item === 'string') {
    return highlight === 'all' ? `**${item}**` : item;
  }

  try {
    let formattedText = '';
    let nameText = '';
    let quantityText = '';
    let notesText = '';
    
    // Extract data based on item type
    if (isShoppingListItem(item)) {
      // Handle ShoppingListItem type
      nameText = item.name;
      quantityText = item.quantity && item.unit ? `${item.quantity} ${item.unit}` : '';
      notesText = item.notes || '';
    } else if (isQuickShoppingItem(item)) {
      // Handle ShoppingItem type from quick recipe
      nameText = item.item || '';
      quantityText = item.quantity ? `${item.quantity} ${item.unit || ''}` : '';
      notesText = item.notes || '';
    } else if (isRecipeIngredient(item)) {
      // Use the existing ingredient formatter for consistency
      formattedText = formatIngredient(item, unitSystem);
      
      // Extract the item name from the ingredient
      nameText = typeof item.item === 'string' 
        ? item.item 
        : typeof item.item === 'object' && item.item && item.item !== null
          ? String((item.item as any).item || (item.item as any).name || 'Ingredient')
          : 'Ingredient';
          
      // For recipe ingredients without pre-formatted text, construct it
      if (!formattedText) {
        const qty = unitSystem === 'metric' 
          ? item.qty_metric !== undefined ? item.qty_metric : item.qty
          : item.qty_imperial !== undefined ? item.qty_imperial : item.qty;
          
        const unit = unitSystem === 'metric'
          ? item.unit_metric || item.unit
          : item.unit_imperial || item.unit;
          
        quantityText = qty !== undefined && unit ? `${qty} ${unit}` : '';
        notesText = item.notes || '';
        
        formattedText = `${quantityText} ${nameText}`.trim();
        if (notesText) formattedText += ` (${notesText})`;
      }
    }

    // If we already have formatted text from formatIngredient, use it as a base
    if (!formattedText) {
      formattedText = `${quantityText} ${nameText}`.trim();
      if (notesText) formattedText += ` (${notesText})`;
    }
    
    // Apply highlighting based on options
    if (highlight === 'name' && nameText) {
      // Replace the name with its bold version
      formattedText = formattedText.replace(
        new RegExp(`\\b${escapeRegExp(nameText)}\\b`, 'i'),
        `**${nameText}**`
      );
    } else if (highlight === 'quantity' && quantityText) {
      // Replace the quantity with its bold version
      formattedText = formattedText.replace(
        quantityText,
        `**${quantityText}**`
      );
    } else if (highlight === 'all') {
      // Bold everything
      formattedText = `**${formattedText}**`;
    }
    
    // Apply strikethrough if needed
    if (strikethrough) {
      formattedText = `~~${formattedText}~~`;
    }
    
    return formattedText;
  } catch (error) {
    // Improved error logging - only log in development environment
    if (process.env.NODE_ENV !== 'production') {
      console.error("Error formatting item:", error);
    }
    
    // Provide a safe fallback
    return typeof item === 'object' && item !== null
      ? JSON.stringify(item)
      : String(item);
  }
}

/**
 * Helper function to escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
