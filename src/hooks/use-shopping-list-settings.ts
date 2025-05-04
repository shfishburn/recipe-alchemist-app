
import { useShoppingListSettingsStore } from '@/stores/shoppingListSettings';

/**
 * Hook wrapper around the shopping list settings store
 * This provides a consistent interface for components
 * while using the Zustand store underneath
 */
export function useShoppingListSettings() {
  const settings = useShoppingListSettingsStore();
  
  return {
    ...settings
  };
}
