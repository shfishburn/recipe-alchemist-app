
import React from 'react';
import { 
  Salad, 
  Beef, 
  Egg, 
  Apple, 
  Carrot, 
  Banana, 
  ShoppingBag,
  Coffee
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface IngredientDepartmentHeaderProps {
  department: string;
}

// Map department names to icons
const getDepartmentIcon = (department: string) => {
  switch (department) {
    case 'Produce':
      return <Salad className="h-4 w-4" />;
    case 'Meat & Seafood':
      return <Beef className="h-4 w-4" />;
    case 'Dairy & Eggs':
      return <Egg className="h-4 w-4" />;
    case 'Bakery':
      return <Apple className="h-4 w-4" />;
    case 'Pantry':
      return <ShoppingBag className="h-4 w-4" />;
    case 'Frozen':
      return <Carrot className="h-4 w-4" />;
    case 'Beverages':
      return <Coffee className="h-4 w-4" />;
    default:
      return <Banana className="h-4 w-4" />;
  }
};

// Get background color for department
const getDepartmentColor = (department: string): string => {
  switch (department) {
    case 'Produce':
      return 'bg-green-50 text-green-800';
    case 'Meat & Seafood':
      return 'bg-red-50 text-red-800';
    case 'Dairy & Eggs':
      return 'bg-yellow-50 text-yellow-800';
    case 'Bakery':
      return 'bg-amber-50 text-amber-800';
    case 'Pantry':
      return 'bg-orange-50 text-orange-800';
    case 'Frozen':
      return 'bg-blue-50 text-blue-800';
    case 'Beverages':
      return 'bg-purple-50 text-purple-800';
    default:
      return 'bg-gray-50 text-gray-800';
  }
};

export function IngredientDepartmentHeader({ department }: IngredientDepartmentHeaderProps) {
  const Icon = getDepartmentIcon(department);
  const colorClass = getDepartmentColor(department);
  
  return (
    <div className={cn("flex items-center px-2 py-1 rounded text-sm font-medium mb-2", colorClass)}>
      {Icon}
      <span className="ml-1.5">{department}</span>
    </div>
  );
}
