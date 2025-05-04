
import React from 'react';
import { Apple, Beef, Egg, BaggageClaim, Package2, Snowflake, Coffee } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

// Get appropriate icon for a department
export function getDepartmentIcon(department: string): LucideIcon | null {
  const deptLower = department.toLowerCase();
  
  if (deptLower.includes('produce') || deptLower.includes('vegetable') || deptLower.includes('fruit')) {
    return Apple;
  }
  
  if (deptLower.includes('meat') || deptLower.includes('seafood') || deptLower.includes('fish')) {
    return Beef;
  }
  
  if (deptLower.includes('dairy') || deptLower.includes('egg')) {
    return Egg;
  }
  
  if (deptLower.includes('bakery') || deptLower.includes('bread')) {
    return BaggageClaim; // Replaced Bread with BaggageClaim as Bread is not available in lucide-react
  }
  
  if (deptLower.includes('pantry') || deptLower.includes('dry')) {
    return Package2;
  }
  
  if (deptLower.includes('frozen')) {
    return Snowflake;
  }
  
  if (deptLower.includes('beverage') || deptLower.includes('drink')) {
    return Coffee;
  }
  
  return null;
}

// Get department color classes
export function getDepartmentColor(department: string): string {
  const deptLower = department.toLowerCase();
  
  if (deptLower.includes('produce') || deptLower.includes('vegetable') || deptLower.includes('fruit')) {
    return 'bg-green-50 text-green-700';
  }
  
  if (deptLower.includes('meat') || deptLower.includes('seafood') || deptLower.includes('fish')) {
    return 'bg-red-50 text-red-700';
  }
  
  if (deptLower.includes('dairy') || deptLower.includes('egg')) {
    return 'bg-blue-50 text-blue-700';
  }
  
  if (deptLower.includes('bakery') || deptLower.includes('bread')) {
    return 'bg-amber-50 text-amber-700';
  }
  
  if (deptLower.includes('pantry') || deptLower.includes('dry') || deptLower === 'other') {
    return 'bg-orange-50 text-orange-700';
  }
  
  if (deptLower.includes('frozen')) {
    return 'bg-indigo-50 text-indigo-700';
  }
  
  if (deptLower.includes('beverage') || deptLower.includes('drink')) {
    return 'bg-purple-50 text-purple-700';
  }
  
  // Default
  return 'bg-gray-50 text-gray-700';
}
