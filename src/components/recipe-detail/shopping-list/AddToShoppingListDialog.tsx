
import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useShoppingLists } from './useShoppingLists';
import { useShoppingListActions } from './useShoppingListActions';
import { ExistingListForm } from './ExistingListForm';
import { NewListForm } from './NewListForm';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import type { Recipe } from '@/types/recipe';

interface AddToShoppingListDialogProps {
  recipe: Recipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddToShoppingListDialog({ recipe, open, onOpenChange }: AddToShoppingListDialogProps) {
  const [activeTab, setActiveTab] = useState<string>('new');
  const { shoppingLists, isFetching, fetchShoppingLists } = useShoppingLists();
  const { createNewList, addToExistingList, isLoading, usePackageSizes } = useShoppingListActions(recipe);
  
  // For local override of package size optimization
  const [localUsePackageSizes, setLocalUsePackageSizes] = useState(usePackageSizes);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  
  // Update local state when global setting changes
  useEffect(() => {
    setLocalUsePackageSizes(usePackageSizes);
  }, [usePackageSizes]);
  
  // Fetch shopping lists when dialog opens
  useEffect(() => {
    if (open) {
      fetchShoppingLists();
    }
  }, [open, fetchShoppingLists]);
  
  const handleCreateNewList = async (name: string) => {
    const result = await createNewList(name, localUsePackageSizes);
    if (result.success) {
      onOpenChange(false);
    }
  };
  
  const handleAddToExistingList = async (listId: string) => {
    const result = await addToExistingList(listId);
    if (result.success) {
      onOpenChange(false);
    }
  };
  
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle className="text-xl text-center">Add to Shopping List</DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4 pb-5 pt-2 space-y-6 overflow-y-auto">
          {/* Settings Section */}
          <div className="space-y-5">
            {/* Package Size Optimization */}
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
                  checked={localUsePackageSizes}
                  onCheckedChange={setLocalUsePackageSizes}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
            </div>
            
            <Separator />
            
            {/* Unit System */}
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
          
          <Separator />
          
          {/* Tabs Section */}
          <Tabs defaultValue="new" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 rounded-full h-12 p-1 bg-muted">
              <TabsTrigger value="new" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-black">
                New List
              </TabsTrigger>
              <TabsTrigger value="existing" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-black">
                Existing Lists
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="new" className="space-y-4 pt-2">
              <NewListForm 
                recipe={recipe}
                onSubmit={handleCreateNewList}
                isLoading={isLoading}
                usePackageSizes={localUsePackageSizes}
                setUsePackageSizes={setLocalUsePackageSizes}
              />
            </TabsContent>
            
            <TabsContent value="existing" className="space-y-4 pt-2">
              <ExistingListForm 
                shoppingLists={shoppingLists}
                isFetching={isFetching}
                onSubmit={handleAddToExistingList}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
