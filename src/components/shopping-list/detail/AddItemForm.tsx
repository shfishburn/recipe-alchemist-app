
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddItemFormProps {
  onAddItem: (item: any) => Promise<void>;
  availableDepartments: string[];
}

export function AddItemForm({ onAddItem, availableDepartments }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [notes, setNotes] = useState('');
  const [department, setDepartment] = useState(availableDepartments[0] || 'Other');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Optional shop size values
  const [shopSizeQty, setShopSizeQty] = useState('');
  const [shopSizeUnit, setShopSizeUnit] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await onAddItem({
        name: name.trim(),
        quantity: quantity ? parseFloat(quantity) : 1,
        unit: unit.trim(),
        notes: notes.trim(),
        department,
        // Include shop size data if provided
        ...(shopSizeQty ? { shop_size_qty: parseFloat(shopSizeQty) } : {}),
        ...(shopSizeUnit ? { shop_size_unit: shopSizeUnit.trim() } : {})
      });
      
      // Reset form on success
      setName('');
      setQuantity('');
      setUnit('');
      setNotes('');
      setShopSizeQty('');
      setShopSizeUnit('');
    } catch (error) {
      console.error('Failed to add item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonUnits = [
    '', 'oz', 'lb', 'g', 'kg', 'cup', 'tbsp', 'tsp', 'each', 'can', 'jar', 'bottle', 'box', 'bag', 'bunch'
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1">
          <Input
            placeholder="Item name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Qty"
            type="number"
            min="0.1"
            step="0.1"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            className="w-20"
          />
          
          <Select 
            value={unit} 
            onValueChange={setUnit}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              {commonUnits.map(unit => (
                <SelectItem key={unit} value={unit}>
                  {unit || 'No unit'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1">
          <Input
            placeholder="Notes (optional)"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>
        <Select 
          value={department}
          onValueChange={setDepartment}
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            {[...availableDepartments, 'Other'].map(dept => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex gap-2 flex-1">
          <Input
            placeholder="Shop Qty (optional)"
            type="number"
            min="0.1"
            step="0.1"
            value={shopSizeQty}
            onChange={e => setShopSizeQty(e.target.value)}
            className="w-24"
          />
          
          <Select 
            value={shopSizeUnit} 
            onValueChange={setShopSizeUnit}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Shop Unit" />
            </SelectTrigger>
            <SelectContent>
              {commonUnits.map(unit => (
                <SelectItem key={unit} value={unit}>
                  {unit || 'No unit'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-xs text-gray-500 flex items-center">
            Purchasable quantity
          </div>
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting || !name.trim()}
        className="w-full"
      >
        Add Item
      </Button>
    </form>
  );
}
