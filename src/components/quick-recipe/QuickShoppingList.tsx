
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingBag, Share2, Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QuickShoppingListProps {
  recipe: QuickRecipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper function to format ingredient for shopping list
const formatIngredient = (ingredient: any): string => {
  if (typeof ingredient === 'string') {
    return ingredient;
  }
  
  const { qty, unit, shop_size_qty, shop_size_unit, item, notes } = ingredient;
  let formatted = '';
  
  // Use shop size if available, otherwise use regular quantity
  const displayQty = shop_size_qty || qty;
  const displayUnit = shop_size_unit || unit;
  
  if (displayQty) {
    formatted += displayQty + ' ';
  }
  
  if (displayUnit) {
    formatted += displayUnit + ' ';
  }
  
  if (typeof item === 'string') {
    formatted += item;
  } else if (item && typeof item.item === 'string') {
    formatted += item.item;
  }
  
  if (notes) {
    formatted += ` (${notes})`;
  }
  
  return formatted.trim();
};

export function QuickShoppingList({ recipe, open, onOpenChange }: QuickShoppingListProps) {
  // Transform ingredients into shopping items with checked state
  const initialItems = recipe.ingredients.map(ingredient => ({
    text: formatIngredient(ingredient),
    checked: false
  }));
  
  // Add extra items for cooking oil, salt, and pepper if not already in the list
  const basicItems = [
    'Cooking oil',
    'Salt',
    'Black pepper'
  ];
  
  // Check if any basic items are missing from the ingredients
  basicItems.forEach(item => {
    const hasItem = initialItems.some(i => 
      i.text.toLowerCase().includes(item.toLowerCase())
    );
    
    if (!hasItem) {
      initialItems.push({
        text: item,
        checked: false
      });
    }
  });
  
  const [items, setItems] = useState(initialItems);
  const [copied, setCopied] = useState(false);
  
  const toggleItem = (index: number) => {
    setItems(items.map((item, i) => 
      i === index ? { ...item, checked: !item.checked } : item
    ));
  };
  
  const copyToClipboard = () => {
    const text = items
      .map(item => `${item.checked ? '[x]' : '[ ]'} ${item.text}`)
      .join('\n');
    
    navigator.clipboard.writeText(text)
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
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping List
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-2">
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <Checkbox 
                  id={`item-${index}`}
                  checked={item.checked}
                  onCheckedChange={() => toggleItem(index)}
                />
                <label 
                  htmlFor={`item-${index}`}
                  className={`text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                >
                  {item.text}
                </label>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={copyToClipboard}
              className="w-full"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
