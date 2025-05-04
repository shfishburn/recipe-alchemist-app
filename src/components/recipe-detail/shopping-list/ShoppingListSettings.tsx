
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  useShoppingListSettingsStore 
} from '@/stores/shoppingListSettings';

export function ShoppingListSettings() {
  const { 
    usePackageSizes, 
    setUsePackageSizes,
    unitSystem,
    setUnitSystem 
  } = useShoppingListSettingsStore();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="package-sizes">Optimize Package Sizes</Label>
          <p className="text-xs text-muted-foreground">
            Calculate quantities based on common grocery package sizes
          </p>
        </div>
        <Switch
          id="package-sizes"
          checked={usePackageSizes}
          onCheckedChange={setUsePackageSizes}
        />
      </div>
      
      <div className="space-y-1.5">
        <Label>Measurement System</Label>
        <RadioGroup
          value={unitSystem}
          onValueChange={(v) => setUnitSystem(v as 'metric' | 'imperial')}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="metric" id="metric" />
            <Label htmlFor="metric">Metric</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="imperial" id="imperial" />
            <Label htmlFor="imperial">Imperial</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
