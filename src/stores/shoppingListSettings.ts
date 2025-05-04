
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ShoppingListSettings {
  usePackageSizes: boolean;
  unitSystem: 'metric' | 'imperial';
}

interface ShoppingListSettingsState extends ShoppingListSettings {
  setUsePackageSizes: (value: boolean) => void;
  setUnitSystem: (value: 'metric' | 'imperial') => void;
}

export const useShoppingListSettingsStore = create<ShoppingListSettingsState>()(
  persist(
    (set) => ({
      usePackageSizes: true,
      unitSystem: 'metric',
      
      setUsePackageSizes: (value: boolean) => set({ usePackageSizes: value }),
      setUnitSystem: (value: 'metric' | 'imperial') => set({ unitSystem: value })
    }),
    {
      name: 'shopping-list-settings', // Local storage key
    }
  )
);

// Hook for components that need to watch the settings
export const useShoppingListSettings = () => {
  const settings = useShoppingListSettingsStore();
  
  return {
    ...settings
  };
};
