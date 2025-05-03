
import { useShoppingListSettingsStore } from '@/stores/shoppingListSettings';

export function useShoppingListSettings() {
  const usePackageSizes = useShoppingListSettingsStore((state) => state.usePackageSizes);
  const setUsePackageSizes = useShoppingListSettingsStore((state) => state.setUsePackageSizes);

  return {
    usePackageSizes,
    setUsePackageSizes
  };
}
