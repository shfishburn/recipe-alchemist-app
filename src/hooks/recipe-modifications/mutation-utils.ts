
import { QuickRecipe } from '@/types/quick-recipe';
import { RecipeModifications } from './types';
import { toast } from 'sonner';

export function applyModificationsToRecipe(modifiedRecipe: QuickRecipe, modifications: RecipeModifications): QuickRecipe {
  const next = JSON.parse(JSON.stringify(modifiedRecipe));
  
  // Apply title and description changes
  if (modifications.modifications.title) {
    next.title = modifications.modifications.title;
  }
  
  if (modifications.modifications.description) {
    next.description = modifications.modifications.description;
  }
  
  // Apply ingredient changes if available
  if (Array.isArray(modifications.modifications.ingredients)) {
    modifications.modifications.ingredients.forEach(change => {
      switch (change.action) {
        case 'add':
          next.ingredients.push({
            item: change.item,
            qty_metric: change.qty_metric,
            unit_metric: change.unit_metric,
            qty_imperial: change.qty_imperial,
            unit_imperial: change.unit_imperial,
            notes: change.notes
          });
          break;
        case 'remove':
          if (typeof change.originalIndex === 'number') {
            next.ingredients.splice(change.originalIndex, 1);
          }
          break;
        case 'modify':
          if (typeof change.originalIndex === 'number') {
            next.ingredients[change.originalIndex] = {
              ...next.ingredients[change.originalIndex],
              item: change.item || next.ingredients[change.originalIndex].item,
              qty_metric: change.qty_metric || next.ingredients[change.originalIndex].qty_metric,
              unit_metric: change.unit_metric || next.ingredients[change.originalIndex].unit_metric,
              qty_imperial: change.qty_imperial || next.ingredients[change.originalIndex].qty_imperial,
              unit_imperial: change.unit_imperial || next.ingredients[change.originalIndex].unit_imperial,
              notes: change.notes || next.ingredients[change.originalIndex].notes
            };
          }
          break;
      }
    });
  }
  
  // Apply step changes if available
  if (Array.isArray(modifications.modifications.steps)) {
    modifications.modifications.steps.forEach(change => {
      switch (change.action) {
        case 'add':
          next.steps.push({
            content: change.content
          });
          // Also update instructions for compatibility
          if (Array.isArray(next.instructions)) {
            next.instructions.push(change.content);
          } else {
            next.instructions = [change.content];
          }
          break;
        case 'remove':
          if (typeof change.originalIndex === 'number') {
            next.steps.splice(change.originalIndex, 1);
            // Also update instructions for compatibility
            if (Array.isArray(next.instructions)) {
              next.instructions.splice(change.originalIndex, 1);
            }
          }
          break;
        case 'modify':
          if (typeof change.originalIndex === 'number') {
            if (next.steps[change.originalIndex]) {
              next.steps[change.originalIndex].content = change.content;
            }
            // Also update instructions for compatibility
            if (Array.isArray(next.instructions) && next.instructions[change.originalIndex]) {
              next.instructions[change.originalIndex] = change.content;
            }
          }
          break;
      }
    });
  }
  
  return next;
}
