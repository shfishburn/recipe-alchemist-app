
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import type { ShoppingList, ShoppingListItem } from '@/types/shopping-list';
import { Check, Plus, Trash2 } from 'lucide-react';

interface ShoppingListDetailProps {
  list: ShoppingList;
  onUpdate: () => void;
}

export function ShoppingListDetail({ list, onUpdate }: ShoppingListDetailProps) {
  const { toast } = useToast();
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('');

  const handleAddItem = async () => {
    if (!newItemName.trim()) return;

    const newItem: ShoppingListItem = {
      name: newItemName.trim(),
      quantity: newItemQuantity,
      unit: newItemUnit.trim(),
      checked: false
    };

    const updatedItems = [...list.items, newItem];

    const { error } = await supabase
      .from('shopping_lists')
      .update({ items: updatedItems })
      .eq('id', list.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item',
        variant: 'destructive'
      });
    } else {
      setNewItemName('');
      setNewItemQuantity(1);
      setNewItemUnit('');
      onUpdate();
      toast({
        title: 'Success',
        description: 'Item added to list'
      });
    }
  };

  const handleToggleItem = async (index: number) => {
    const updatedItems = [...list.items];
    updatedItems[index] = {
      ...updatedItems[index],
      checked: !updatedItems[index].checked
    };

    const { error } = await supabase
      .from('shopping_lists')
      .update({ items: updatedItems })
      .eq('id', list.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update item',
        variant: 'destructive'
      });
    } else {
      onUpdate();
    }
  };

  const handleDeleteItem = async (index: number) => {
    const updatedItems = list.items.filter((_, i) => i !== index);

    const { error } = await supabase
      .from('shopping_lists')
      .update({ items: updatedItems })
      .eq('id', list.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive'
      });
    } else {
      onUpdate();
      toast({
        title: 'Success',
        description: 'Item removed from list'
      });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">{list.title}</h2>
      
      <div className="space-y-4">
        {/* Add new item form */}
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Item name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="flex-1"
          />
          <Input
            type="number"
            min="1"
            placeholder="Qty"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(Number(e.target.value))}
            className="w-24"
          />
          <Input
            placeholder="Unit"
            value={newItemUnit}
            onChange={(e) => setNewItemUnit(e.target.value)}
            className="w-24"
          />
          <Button onClick={handleAddItem}><Plus className="mr-2" />Add Item</Button>
        </div>

        {/* Items list */}
        <div className="space-y-2">
          {list.items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-muted/40 rounded-md">
              <Checkbox
                checked={item.checked}
                onCheckedChange={() => handleToggleItem(index)}
                id={`item-${index}`}
              />
              <Label 
                htmlFor={`item-${index}`}
                className={`flex-1 ${item.checked ? 'line-through text-muted-foreground' : ''}`}
              >
                {item.quantity} {item.unit} {item.name}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteItem(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
