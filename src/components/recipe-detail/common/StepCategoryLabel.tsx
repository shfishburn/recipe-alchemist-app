
import React from 'react';
import { 
  ChefHat, 
  Utensils, 
  Flame,
  CookingPot,
  EggFried,
  Carrot,
  Apple
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type StepCategory = 
  | 'prep' 
  | 'cooking' 
  | 'baking' 
  | 'frying' 
  | 'seasoning' 
  | 'plating' 
  | 'serving' 
  | 'other';

interface StepCategoryLabelProps {
  category?: StepCategory | string;
  className?: string;
}

// Map categories to icons and colors
const categoryConfig: Record<string, { icon: React.ReactNode, color: string, label: string }> = {
  prep: {
    icon: <ChefHat className="h-3 w-3" />,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    label: 'Prep'
  },
  cooking: {
    icon: <Flame className="h-3 w-3" />,
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    label: 'Cooking'
  },
  baking: {
    icon: <CookingPot className="h-3 w-3" />,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    label: 'Baking'
  },
  frying: {
    icon: <CookingPot className="h-3 w-3" />,
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    label: 'Frying'
  },
  seasoning: {
    icon: <EggFried className="h-3 w-3" />,
    color: 'bg-green-50 text-green-700 border-green-200',
    label: 'Seasoning'
  },
  plating: {
    icon: <Utensils className="h-3 w-3" />,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    label: 'Plating'
  },
  serving: {
    icon: <Utensils className="h-3 w-3" />,
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    label: 'Serving'
  },
  other: {
    icon: <Carrot className="h-3 w-3" />,
    color: 'bg-gray-50 text-gray-700 border-gray-200',
    label: 'Other'
  }
};

export function StepCategoryLabel({ category, className }: StepCategoryLabelProps) {
  if (!category) return null;
  
  // Convert category to lowercase for matching
  const key = category.toLowerCase();
  
  // Get configuration or use default
  const config = categoryConfig[key] || {
    icon: <Apple className="h-3 w-3" />,
    color: 'bg-gray-50 text-gray-700 border-gray-200',
    label: category
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center text-xs px-1.5 py-0.5 rounded border",
        config.color,
        className
      )}
    >
      {config.icon}
      <span className="ml-1">{config.label}</span>
    </span>
  );
}
