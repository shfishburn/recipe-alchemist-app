
import React from 'react';
import { 
  Carrot, 
  Utensils, 
  MilkOff, 
  WheatOff, 
  Package, 
  Snowflake, 
  Coffee, 
  ShoppingBag,
  LucideIcon
} from 'lucide-react';

// Map department names to icons
export function getDepartmentIcon(department: string): LucideIcon {
  // Normalize the department name for comparison
  const normalizedDept = department.toLowerCase().trim();
  
  // Map department names to icons
  if (normalizedDept.includes('produce') || normalizedDept.includes('vegetable') || normalizedDept.includes('fruit')) {
    return Carrot;
  }
  
  if (normalizedDept.includes('meat') || normalizedDept.includes('seafood') || normalizedDept.includes('protein')) {
    return Utensils;
  }
  
  if (normalizedDept.includes('dairy') || normalizedDept.includes('egg') || normalizedDept.includes('milk')) {
    return MilkOff;
  }
  
  if (normalizedDept.includes('bakery') || normalizedDept.includes('bread') || normalizedDept.includes('grain')) {
    return WheatOff;
  }
  
  if (normalizedDept.includes('frozen')) {
    return Snowflake;
  }
  
  if (normalizedDept.includes('beverage') || normalizedDept.includes('drink')) {
    return Coffee;
  }
  
  if (normalizedDept.includes('pantry') || normalizedDept.includes('canned') || normalizedDept.includes('dry')) {
    return Package;
  }
  
  // Default icon for other departments
  return ShoppingBag;
}

// Map department names to color classes
export function getDepartmentColor(department: string): string {
  // Normalize the department name for comparison
  const normalizedDept = department.toLowerCase().trim();
  
  // Map department names to color classes
  if (normalizedDept.includes('produce') || normalizedDept.includes('vegetable') || normalizedDept.includes('fruit')) {
    return 'bg-green-50 dark:bg-green-950/30';
  }
  
  if (normalizedDept.includes('meat') || normalizedDept.includes('seafood') || normalizedDept.includes('protein')) {
    return 'bg-red-50 dark:bg-red-950/30';
  }
  
  if (normalizedDept.includes('dairy') || normalizedDept.includes('egg') || normalizedDept.includes('milk')) {
    return 'bg-blue-50 dark:bg-blue-950/30';
  }
  
  if (normalizedDept.includes('bakery') || normalizedDept.includes('bread') || normalizedDept.includes('grain')) {
    return 'bg-amber-50 dark:bg-amber-950/30';
  }
  
  if (normalizedDept.includes('frozen')) {
    return 'bg-cyan-50 dark:bg-cyan-950/30';
  }
  
  if (normalizedDept.includes('beverage') || normalizedDept.includes('drink')) {
    return 'bg-orange-50 dark:bg-orange-950/30';
  }
  
  if (normalizedDept.includes('pantry') || normalizedDept.includes('canned') || normalizedDept.includes('dry')) {
    return 'bg-yellow-50 dark:bg-yellow-950/30';
  }
  
  if (normalizedDept.includes('spice') || normalizedDept.includes('herb')) {
    return 'bg-purple-50 dark:bg-purple-950/30';
  }
  
  if (normalizedDept.includes('snack') || normalizedDept.includes('sweet')) {
    return 'bg-pink-50 dark:bg-pink-950/30';
  }
  
  // Default color for other departments
  return 'bg-gray-50 dark:bg-gray-800/30';
}
