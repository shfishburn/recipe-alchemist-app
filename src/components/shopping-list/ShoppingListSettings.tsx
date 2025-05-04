
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useShoppingListSettings } from '@/hooks/use-shopping-list-settings';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

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
      
      <Separator className="my-2" />
      
      <div className="flex items-center justify-between">
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
        <div className="flex items-center space-x-2">
          <Label htmlFor="unit-system-metric" className={`text-sm cursor-pointer ${unitSystem === 'metric' ? 'font-medium' : 'text-muted-foreground'}`}>
            Metric
          </Label>
          <Switch 
            id="unit-system"
            checked={unitSystem === 'imperial'}
            onCheckedChange={(checked) => setUnitSystem(checked ? 'imperial' : 'metric')}
          />
          <Label htmlFor="unit-system-imperial" className={`text-sm cursor-pointer ${unitSystem === 'imperial' ? 'font-medium' : 'text-muted-foreground'}`}>
            Imperial
          </Label>
        </div>
      </div>
    </div>
  );
}
