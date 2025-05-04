
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useShoppingListSettings } from '@/hooks/use-shopping-list-settings';

export function ShoppingListSettings() {
  const { usePackageSizes, setUsePackageSizes } = useShoppingListSettings();
  
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="use-package-sizes" 
        checked={usePackageSizes}
        onCheckedChange={setUsePackageSizes}
      />
      <Label htmlFor="use-package-sizes">
        Optimize for package sizes
      </Label>
    </div>
  );
}
