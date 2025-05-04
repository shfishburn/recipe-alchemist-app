
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingListSettings } from '@/components/shopping-list/ShoppingListSettings';
import { NewListForm } from './NewListForm';
import { ExistingListForm } from './ExistingListForm';
import { Separator } from '@/components/ui/separator';
import type { ShoppingListSummary } from '@/types/shopping-list';
import type { Recipe } from '@/types/recipe';

interface AddToListSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  recipe: Recipe;
  usePackageSizes: boolean;
  setUsePackageSizes: (value: boolean) => void;
  shoppingLists: ShoppingListSummary[];
  isFetching: boolean;
  onCreateNewList: (name: string) => Promise<void>;
  onAddToExistingList: (id: string) => Promise<void>;
}

export function AddToListSheet({
  open,
  onOpenChange,
  isLoading,
  recipe,
  usePackageSizes,
  setUsePackageSizes,
  shoppingLists,
  isFetching,
  onCreateNewList,
  onAddToExistingList
}: AddToListSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[90vw] sm:max-w-md p-6">
        <SheetHeader>
          <SheetTitle className="text-xl text-center">Add to Shopping List</SheetTitle>
        </SheetHeader>
        
        <div className="py-5 space-y-6">
          <ShoppingListSettings />
          
          <Separator className="my-2" />
          
          <Tabs defaultValue="new" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 rounded-full h-12 p-1 bg-muted">
              <TabsTrigger value="new" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-black">
                New List
              </TabsTrigger>
              <TabsTrigger value="existing" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-black">
                Existing Lists
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="new" className="space-y-4">
              <NewListForm 
                recipe={recipe}
                onSubmit={onCreateNewList}
                isLoading={isLoading}
                usePackageSizes={usePackageSizes}
                setUsePackageSizes={setUsePackageSizes}
              />
            </TabsContent>
            
            <TabsContent value="existing" className="space-y-4">
              <ExistingListForm 
                shoppingLists={shoppingLists}
                isFetching={isFetching}
                onSubmit={onAddToExistingList}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
