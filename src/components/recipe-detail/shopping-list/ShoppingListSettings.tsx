
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useShoppingListSettings } from '@/hooks/use-shopping-list-settings';
import { HelpCircle } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { UnitSystemToggle } from '@/components/ui/unit-system-toggle';
import { Separator } from '@/components/ui/separator';

export function ShoppingListSettings({ overrideEnabled = false, onOverrideChange = undefined }) {
  const { 
    usePackageSizes, 
    setUsePackageSizes, 
    unitSystem 
  } = useShoppingListSettings();
  
  // Use override props if provided, otherwise use the global state
  const isPackageSizesEnabled = overrideEnabled !== undefined 
    ? overrideEnabled 
    : usePackageSizes;
  
  const handlePackageSizesChange = (checked: boolean) => {
    if (onOverrideChange) {
      onOverrideChange(checked);
    } else {
      setUsePackageSizes(checked);
    }
  };
  
  return (
    <div className="space-y-5">
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
          checked={isPackageSizesEnabled}
          onCheckedChange={handlePackageSizesChange}
          className="data-[state=checked]:bg-primary"
        />
      </div>
      
      <Separator className="my-2" />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Label htmlFor="unit-system" className="cursor-pointer">
            Unit system
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[250px]">
                Choose between metric (g, kg, ml, l) or imperial (oz, lb, fl oz, cups) units
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <UnitSystemToggle 
          className="w-full sm:w-auto justify-center sm:justify-start" 
        />
      </div>
    </div>
  );
}
