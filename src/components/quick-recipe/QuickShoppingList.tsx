
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ShoppingItem, ShoppingItemsByDepartment } from './shopping-list/types';
import { createShoppingItems, groupItemsByDepartment, formatShoppingListForClipboard } from './shopping-list/utils';
import { ShoppingListDepartment } from './shopping-list/ShoppingListDepartment';

interface QuickShoppingListProps {
  recipe: QuickRecipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickShoppingList({ recipe, open, onOpenChange }: QuickShoppingListProps) {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [itemsByDepartment, setItemsByDepartment] = useState<ShoppingItemsByDepartment>({});
  const [copied, setCopied] = useState(false);
  
  // Create a mapping of item text to index for efficient lookups
  const itemIndices = items.reduce((acc, item, index) => {
    acc[item.text] = index;
    return acc;
  }, {} as Record<string, number>);
  
  // Initialize items when the recipe changes or modal opens
  useEffect(() => {
    if (open) {
      const shoppingItems = createShoppingItems(recipe);
      setItems(shoppingItems);
      setItemsByDepartment(groupItemsByDepartment(shoppingItems));
    }
  }, [recipe, open]);
  
  const toggleItem = (index: number) => {
    const updatedItems = items.map((item, i) => 
      i === index ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems);
    setItemsByDepartment(groupItemsByDepartment(updatedItems));
  };
  
  const copyToClipboard = () => {
    const textByDepartments = formatShoppingListForClipboard(itemsByDepartment);
    
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shopping List
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center gap-2"
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
        </DialogHeader>
        
        <div className="mt-2">
          <div className="space-y-4">
            {Object.entries(itemsByDepartment).map(([department, deptItems]) => (
              <ShoppingListDepartment
                key={department}
                department={department}
                items={deptItems}
                onToggleItem={toggleItem}
                itemIndices={itemIndices}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
