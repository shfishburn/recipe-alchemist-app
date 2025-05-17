
import { ReactNode } from 'react';

/**
 * Safely converts a complex ingredient item to a ReactNode
 * @param item The ingredient item which could be a string or object with a name property
 */
export function ingredientToReactNode(item: string | { name: string; [key: string]: any }): ReactNode {
  if (typeof item === 'string') {
    return item;
  }
  
  if (item && typeof item === 'object' && 'name' in item) {
    return String(item.name);
  }
  
  return 'Unknown ingredient';
}
