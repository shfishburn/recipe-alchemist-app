
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import type { ShoppingList, ShoppingListItem } from '@/types/shopping-list';
import { Check, Plus, Trash2, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";

interface ShoppingListDetailProps {
  list: ShoppingList;
  onUpdate: () => void;
}

export function ShoppingListDetail({ list, onUpdate }: ShoppingListDetailProps) {
  const { toast } = useToast();
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('Other');

  // Group items by department
  const itemsByDepartment = list.items.reduce((acc, item) => {
    const dept = item.department || 'Other';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(item);
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);

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
      
      {/* Shopping Tips */}
      {list.tips && list.tips.length > 0 && (
        <div className="mb-6 p-4 bg-muted rounded-md">
          <h3 className="font-medium mb-2">Shopping Tips:</h3>
          <ul className="list-disc list-inside space-y-1">
            {list.tips.map((tip, index) => (
              <li key={index} className="text-sm text-muted-foreground">{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Preparation Notes */}
      {list.preparation_notes && list.preparation_notes.length > 0 && (
        <div className="mb-6 p-4 bg-muted/50 rounded-md">
          <h3 className="font-medium mb-2">Preparation Notes:</h3>
          <ul className="list-disc list-inside space-y-1">
            {list.preparation_notes.map((note, index) => (
              <li key={index} className="text-sm text-muted-foreground">{note}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="space-y-6">
        {Object.entries(itemsByDepartment).map(([department, items]) => (
          <div key={department} className="space-y-2">
            <h3 className="font-medium text-lg">{department}</h3>
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted/40 rounded-md group">
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={() => handleToggleItem(list.items.indexOf(item))}
                  id={`item-${department}-${index}`}
                />
                <Label 
                  htmlFor={`item-${department}-${index}`}
                  className={`flex-1 ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <span>{item.quantity} {item.unit} {item.name}</span>
                    {(item.quality_indicators || item.storage_tips) && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            {item.quality_indicators && (
                              <p className="mb-1">{item.quality_indicators}</p>
                            )}
                            {item.storage_tips && (
                              <p className="text-sm text-muted-foreground">{item.storage_tips}</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </span>
                  {item.notes && (
                    <span className="block text-sm text-muted-foreground">{item.notes}</span>
                  )}
                  {item.alternatives?.length > 0 && (
                    <span className="block text-sm text-muted-foreground">
                      Alternatives: {item.alternatives.join(', ')}
                    </span>
                  )}
                  {item.pantry_staple && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded ml-2">
                      Pantry Staple
                    </span>
                  )}
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteItem(list.items.indexOf(item))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}
