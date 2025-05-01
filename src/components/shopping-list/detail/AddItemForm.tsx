
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
    <form className="mb-6 p-4 border rounded-md" onSubmit={handleSubmit}>
      <h3 className="font-medium mb-3">Add New Item</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2">
          <Label htmlFor="itemName">Item Name</Label>
          <Input
            id="itemName"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Enter item name"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="itemQty">Quantity</Label>
          <Input
            id="itemQty"
            type="number"
            min="0"
            step="any"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="itemUnit">Unit</Label>
          <Input
            id="itemUnit"
            value={newItemUnit}
            onChange={(e) => setNewItemUnit(e.target.value)}
            placeholder="e.g., g, kg, cup"
            className="mt-1"
          />
        </div>
        <div className="md:col-span-3">
          <Label htmlFor="itemDept">Department</Label>
          <Select 
            value={selectedDepartment} 
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger id="itemDept" className="mt-1">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {/* Include existing departments */}
              {availableDepartments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
              {/* Add common departments if they don't exist */}
              {!availableDepartments.includes('Produce') && <SelectItem value="Produce">Produce</SelectItem>}
              {!availableDepartments.includes('Dairy') && <SelectItem value="Dairy">Dairy</SelectItem>}
              {!availableDepartments.includes('Meat') && <SelectItem value="Meat">Meat</SelectItem>}
              {!availableDepartments.includes('Pantry') && <SelectItem value="Pantry">Pantry</SelectItem>}
              {!availableDepartments.includes('Other') && <SelectItem value="Other">Other</SelectItem>}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-1">
          <Label className="invisible">Add</Label>
          <Button type="submit" className="w-full mt-1" disabled={!newItemName.trim()}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>
    </form>
  );
}
