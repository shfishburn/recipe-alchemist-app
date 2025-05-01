
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface ShoppingListControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOrder: 'asc' | 'desc' | 'dept';
  onSortOrderChange: (value: 'asc' | 'desc' | 'dept') => void;
}

export function ShoppingListControls({ 
  searchTerm, 
  onSearchChange, 
  sortOrder, 
  onSortOrderChange 
}: ShoppingListControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Filter items"
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Select 
        value={sortOrder} 
        onValueChange={(value) => onSortOrderChange(value as 'asc' | 'desc' | 'dept')}
      >
        <SelectTrigger className="w-full sm:w-32">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dept">By Department</SelectItem>
          <SelectItem value="asc">Name A-Z</SelectItem>
          <SelectItem value="desc">Name Z-A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
