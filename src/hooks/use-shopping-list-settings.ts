
import { useState, useEffect } from 'react';

interface ShoppingListSettings {
  usePackageSizes: boolean;
}

// Default settings
const defaultSettings: ShoppingListSettings = {
  usePackageSizes: true
};

export const useShoppingListSettings = () => {
  // Initialize state with default settings
  const [settings, setSettings] = useState<ShoppingListSettings>(() => {
    // Try to load settings from local storage
    const savedSettings = localStorage.getItem('shopping-list-settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Update a specific setting
  const updateSetting = <K extends keyof ShoppingListSettings>(
    key: K, 
    value: ShoppingListSettings[K]
  ) => {
    setSettings(prevSettings => {
      const newSettings = { ...prevSettings, [key]: value };
      // Save to local storage
      localStorage.setItem('shopping-list-settings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  // Convenience setters for specific settings
  const setUsePackageSizes = (value: boolean) => updateSetting('usePackageSizes', value);

  useEffect(() => {
    // Ensure settings are saved to localStorage when changed
    localStorage.setItem('shopping-list-settings', JSON.stringify(settings));
  }, [settings]);

  return {
    ...settings,
    setUsePackageSizes,
    updateSetting
  };
};
