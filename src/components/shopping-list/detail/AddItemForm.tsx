
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { ShoppingListItem } from '@/types/shopping-list';

interface AddItemFormProps {
  onAddItem: (item: Omit<ShoppingListItem, 'checked'>) => Promise<void>;
  availableDepartments: string[];
}

export function AddItemForm({ onAddItem, availableDepartments }: AddItemFormProps) {
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('Other');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItemName.trim()) return;
    
    await onAddItem({
      name: newItemName.trim(),
      quantity: newItemQuantity,
      unit: newItemUnit,
      department: selectedDepartment
    });

    // Reset form
    setNewItemName('');
    setNewItemQuantity(1);
    setNewItemUnit('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-5">
          <Input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Item name"
          />
        </div>
        <div className="col-span-6 sm:col-span-2">
          <Input
            type="number"
            min="0"
            step="any"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(Number(e.target.value))}
            placeholder="Qty"
          />
        </div>
        <div className="col-span-6 sm:col-span-2">
          <Input
            value={newItemUnit}
            onChange={(e) => setNewItemUnit(e.target.value)}
            placeholder="Unit"
          />
        </div>
        <div className="col-span-9 sm:col-span-2">
          <Select 
            value={selectedDepartment} 
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger id="itemDept">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {availableDepartments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
              {!availableDepartments.includes('Produce') && <SelectItem value="Produce">Produce</SelectItem>}
              {!availableDepartments.includes('Dairy') && <SelectItem value="Dairy">Dairy</SelectItem>}
              {!availableDepartments.includes('Meat') && <SelectItem value="Meat">Meat</SelectItem>}
              {!availableDepartments.includes('Pantry') && <SelectItem value="Pantry">Pantry</SelectItem>}
              {!availableDepartments.includes('Other') && <SelectItem value="Other">Other</SelectItem>}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-3 sm:col-span-1">
          <Button type="submit" className="w-full" disabled={!newItemName.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}
