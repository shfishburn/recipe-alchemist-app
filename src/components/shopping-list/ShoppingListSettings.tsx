
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
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label htmlFor="use-package-sizes" className="text-base font-medium">
              Optimize for package sizes
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px]">
                  Adjust quantities to match common grocery package sizes
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch 
            id="use-package-sizes" 
            checked={usePackageSizes}
            onCheckedChange={setUsePackageSizes}
            className="data-[state=checked]:bg-green-600"
          />
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex flex-col gap-2">
        <Label className="text-base font-medium">Unit system</Label>
        <div className="flex items-center justify-between mt-2">
          <span className={`text-base ${unitSystem === 'metric' ? 'font-medium' : 'text-muted-foreground'}`}>
            Metric
          </span>
          <Switch 
            checked={unitSystem === 'imperial'}
            onCheckedChange={(checked) => setUnitSystem(checked ? 'imperial' : 'metric')}
            className="data-[state=checked]:bg-blue-600 mx-4"
          />
          <span className={`text-base ${unitSystem === 'imperial' ? 'font-medium' : 'text-muted-foreground'}`}>
            Imperial
          </span>
        </div>
      </div>
    </div>
  );
}
