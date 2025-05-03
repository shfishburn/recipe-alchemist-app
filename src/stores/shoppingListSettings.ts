
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ShoppingListSettingsState {
  usePackageSizes: boolean;
  setUsePackageSizes: (value: boolean) => void;
}

export const useShoppingListSettingsStore = create<ShoppingListSettingsState>()(
  persist(
    (set) => ({
      usePackageSizes: true, // Default to using package sizes
      setUsePackageSizes: (value: boolean) => set({ usePackageSizes: value }),
    }),
    {
      name: 'shopping-list-settings', // Local storage key
    }
  )
);
