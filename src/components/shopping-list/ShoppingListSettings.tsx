
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ShoppingBag, ListCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ShoppingListSettingsProps {
  usePackageSizes: boolean;
  setUsePackageSizes: (value: boolean) => void;
}

export function ShoppingListSettings({ usePackageSizes, setUsePackageSizes }: ShoppingListSettingsProps) {
  return (
    <div className="border rounded-md p-3 bg-muted/30">
      <h3 className="text-sm font-medium flex items-center mb-3">
        <ShoppingBag className="h-4 w-4 mr-2" />
        Shopping List Settings
      </h3>

      <div className="space-y-3">
        <div className="flex flex-row items-center justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <ListCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Label htmlFor="use-package-sizes" className="text-sm cursor-pointer">
                    Use package sizes
                  </Label>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  When enabled, items are optimized for shopping by using standard package sizes
                  (e.g., 5lb bags of flour instead of exact amounts)
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Switch
            id="use-package-sizes"
            checked={usePackageSizes}
            onCheckedChange={setUsePackageSizes}
          />
        </div>
      </div>
    </div>
  );
}
