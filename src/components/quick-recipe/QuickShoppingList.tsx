
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Copy, Check, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ShoppingItem, ShoppingItemsByDepartment } from './shopping-list/types';
import { createShoppingItems, groupItemsByDepartment, formatShoppingListForClipboard } from './shopping-list/utils';
import { ShoppingListDepartment } from './shopping-list/ShoppingListDepartment';
import { useUnitSystem } from '@/hooks/use-unit-system';
import { useIsMobile } from '@/hooks/use-mobile';
import { UnitSystemToggle } from '@/components/ui/unit-system-toggle';

interface QuickShoppingListProps {
  recipe: QuickRecipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickShoppingList({ recipe, open, onOpenChange }: QuickShoppingListProps) {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [itemsByDepartment, setItemsByDepartment] = useState<ShoppingItemsByDepartment>({});
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { unitSystem } = useUnitSystem();
  const isMobile = useIsMobile();
  
  // Create a mapping of item text to index for efficient lookups
  const itemIndices = items.reduce((acc, item, index) => {
    acc[item.text] = index;
    return acc;
  }, {} as Record<string, number>);
  
  // Initialize items when the recipe changes or modal opens
  useEffect(() => {
    const initializeItems = async () => {
      if (open) {
        setIsLoading(true);
        try {
          console.log("Fetching shopping items for recipe:", recipe.title);
          const shoppingItems = await createShoppingItems(recipe);
          console.log("Shopping items created:", shoppingItems.length);
          setItems(shoppingItems);
          
          const grouped = groupItemsByDepartment(shoppingItems);
          console.log("Items grouped by department:", Object.keys(grouped).length, "departments");
          setItemsByDepartment(grouped);
        } catch (error) {
          console.error("Error creating shopping items:", error);
          toast({
            title: "Error",
            description: "Failed to generate shopping list",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        // Reset when closed
        setCopied(false);
      }
    };
    
    initializeItems();
  }, [recipe, open, unitSystem]); // Include unitSystem to regenerate when preference changes
  
  const toggleItem = (index: number) => {
    const updatedItems = items.map((item, i) => 
      i === index ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems);
    setItemsByDepartment(groupItemsByDepartment(updatedItems));
  };
  
  const copyToClipboard = () => {
    const textByDepartments = formatShoppingListForClipboard(itemsByDepartment, unitSystem);
    
    navigator.clipboard.writeText(textByDepartments)
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied to clipboard",
          description: "Shopping list copied to clipboard"
        });
        
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard",
          variant: "destructive"
        });
      });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={isMobile ? "w-[95vw] max-w-md p-6" : "sm:max-w-md"}>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shopping List
            </DialogTitle>
            <div className="flex items-center gap-2">
              <UnitSystemToggle size="sm" />
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-2 h-10 px-4"
                disabled={isLoading}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">Generating optimized shopping list...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(itemsByDepartment).length > 0 ? (
                Object.entries(itemsByDepartment).map(([department, deptItems]) => (
                  <ShoppingListDepartment
                    key={department}
                    department={department}
                    items={deptItems}
                    onToggleItem={toggleItem}
                    itemIndices={itemIndices}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No items found</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
