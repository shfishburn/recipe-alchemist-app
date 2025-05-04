
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useShoppingListSettings } from '@/hooks/use-shopping-list-settings';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function ShoppingListSettings() {
  const { usePackageSizes, setUsePackageSizes, unitSystem, setUnitSystem } = useShoppingListSettings();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor="use-package-sizes" className="cursor-pointer">
            Optimize for package sizes
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[250px]">
                When enabled, shopping list items will be adjusted to align with common package sizes from grocery stores
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Switch 
          id="use-package-sizes" 
          checked={usePackageSizes}
          onCheckedChange={setUsePackageSizes}
        />
      </div>
    </div>
  );
}
