
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose
} from '@/components/ui/sheet';
import { Check, Plus, ShoppingBag, X } from 'lucide-react';
import type { QuickRecipe } from '@/hooks/use-quick-recipe';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface QuickShoppingListProps {
  recipe: QuickRecipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
}

export function QuickShoppingList({ recipe, open, onOpenChange, onSave }: QuickShoppingListProps) {
  const [items, setItems] = useState(recipe.ingredients.map(ingredient => ({
    text: ingredient,
    checked: false
  })));
  const [customItem, setCustomItem] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  const toggleItemChecked = (index: number) => {
    setItems(items.map((item, i) => 
      i === index ? { ...item, checked: !item.checked } : item
    ));
  };

  const addCustomItem = () => {
    if (customItem.trim()) {
      setItems([...items, { text: customItem.trim(), checked: false }]);
      setCustomItem('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomItem();
    }
  };

  const handleSave = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Create an account to save your shopping list",
        variant: "default",
      });
    } else if (onSave) {
      onSave();
      toast({
        title: "Shopping list saved",
        description: "Your list has been saved to your account",
      });
    }
  };

  const checkedCount = items.filter(item => item.checked).length;
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[90vw] sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Shopping List
          </SheetTitle>
        </SheetHeader>
        
        <div className="py-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Ingredients for {recipe.title}</h3>
            <span className="text-xs text-muted-foreground">
              {checkedCount}/{items.length} items
            </span>
          </div>
          
          <ul className="space-y-2 mt-4">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <Checkbox 
                  id={`item-${idx}`} 
                  checked={item.checked}
                  onCheckedChange={() => toggleItemChecked(idx)}
                />
                <label 
                  htmlFor={`item-${idx}`}
                  className={`flex-1 text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                >
                  {item.text}
                </label>
              </li>
            ))}
          </ul>
          
          <div className="flex mt-6 gap-2">
            <input
              type="text"
              value={customItem}
              onChange={(e) => setCustomItem(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add custom item..."
              className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-recipe-blue focus:border-recipe-blue"
            />
            <Button 
              type="button" 
              size="sm" 
              variant="outline"
              onClick={addCustomItem}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <SheetFooter>
          <div className="flex flex-col gap-2 w-full">
            <Button 
              onClick={handleSave}
              className="w-full bg-recipe-blue hover:bg-recipe-blue/90"
            >
              Save Shopping List
            </Button>
            <SheetClose asChild>
              <Button variant="ghost" size="sm" className="w-full">
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
