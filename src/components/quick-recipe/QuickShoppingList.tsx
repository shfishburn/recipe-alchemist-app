
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingBag, Share2, Copy, Check, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";

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
  const displayQty = shop_size_qty !== undefined ? shop_size_qty : qty;
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
    checked: false,
    department: 'Recipe Ingredients'
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
        checked: false,
        department: 'Pantry Staples',
        pantryStaple: true
      });
    }
  });
  
  // Group items by department
  const itemsByDepartment = initialItems.reduce((acc, item) => {
    const dept = item.department || 'Recipe Ingredients';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(item);
    return acc;
  }, {} as Record<string, typeof initialItems>);
  
  const [items, setItems] = useState(initialItems);
  const [copied, setCopied] = useState(false);
  
  const toggleItem = (index: number) => {
    setItems(items.map((item, i) => 
      i === index ? { ...item, checked: !item.checked } : item
    ));
  };
  
  const copyToClipboard = () => {
    // Format list by departments
    const textByDepartments = Object.entries(itemsByDepartment)
      .map(([department, deptItems]) => {
        const itemTexts = deptItems.map(item => 
          `${item.checked ? '[x]' : '[ ]'} ${item.text}`
        );
        return `## ${department}\n${itemTexts.join('\n')}`;
      }).join('\n\n');
    
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
              <div key={department} className="space-y-2">
                <h3 className="font-medium text-sm">{department}</h3>
                {deptItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-muted/40 rounded-md">
                    <Checkbox 
                      id={`item-${index}`}
                      checked={item.checked}
                      onCheckedChange={() => toggleItem(items.indexOf(item))}
                    />
                    <label 
                      htmlFor={`item-${index}`}
                      className={`text-sm flex-1 ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {item.text}
                      {item.pantryStaple && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded ml-2">
                          Pantry Staple
                        </span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
