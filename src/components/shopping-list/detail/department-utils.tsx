
import React from 'react';
import { 
  Apple, 
  Beef, 
  Egg, 
  BaggageClaim, 
  Package2, 
  Snowflake, 
  Coffee,
  ShoppingCart,
  CookingPot,
  Baby,
  Pill,
  Home,
  Utensils
} from 'lucide-react';
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
    return BaggageClaim; 
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
  
  if (deptLower.includes('household') || deptLower.includes('cleaning')) {
    return Home;
  }
  
  if (deptLower.includes('health') || deptLower.includes('personal')) {
    return Pill;
  }
  
  if (deptLower.includes('baby')) {
    return Baby;
  }
  
  if (deptLower.includes('deli') || deptLower.includes('prepared')) {
    return CookingPot;
  }

  if (deptLower.includes('spice') || deptLower.includes('herb')) {
    return Utensils;
  }

  // Default icon
  return ShoppingCart;
}

// Get department color classes with more variety and better visual hierarchy
export function getDepartmentColor(department: string): string {
  const deptLower = department.toLowerCase();
  
  if (deptLower.includes('produce') || deptLower.includes('vegetable') || deptLower.includes('fruit')) {
    return 'bg-gradient-to-r from-green-50 to-green-100 text-green-800';
  }
  
  if (deptLower.includes('meat') || deptLower.includes('seafood') || deptLower.includes('fish')) {
    return 'bg-gradient-to-r from-red-50 to-red-100 text-red-800';
  }
  
  if (deptLower.includes('dairy') || deptLower.includes('egg')) {
    return 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800';
  }
  
  if (deptLower.includes('bakery') || deptLower.includes('bread')) {
    return 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800';
  }
  
  if (deptLower.includes('pantry') || deptLower.includes('dry') || deptLower === 'other') {
    return 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800';
  }
  
  if (deptLower.includes('frozen')) {
    return 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-800';
  }
  
  if (deptLower.includes('beverage') || deptLower.includes('drink')) {
    return 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800';
  }

  if (deptLower.includes('household') || deptLower.includes('cleaning')) {
    return 'bg-gradient-to-r from-cyan-50 to-cyan-100 text-cyan-800';
  }
  
  if (deptLower.includes('health') || deptLower.includes('personal')) {
    return 'bg-gradient-to-r from-pink-50 to-pink-100 text-pink-800';
  }
  
  if (deptLower.includes('baby')) {
    return 'bg-gradient-to-r from-sky-50 to-sky-100 text-sky-800';
  }
  
  if (deptLower.includes('deli') || deptLower.includes('prepared')) {
    return 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800';
  }
  
  // Default
  return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800';
}
