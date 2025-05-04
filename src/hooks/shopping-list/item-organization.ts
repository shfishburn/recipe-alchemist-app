import { ShoppingListItem } from '@/types/shopping-list';

/**
 * Group shopping list items by department
 */
export function groupItemsByDepartment(items: ShoppingListItem[]): Record<string, ShoppingListItem[]> {
  return items.reduce((acc, item) => {
    const dept = item.department || 'Other';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(item);
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);
}

/**
 * Filter and organize items based on search term and sort order
 */
export function organizeItems(
  items: ShoppingListItem[],
  searchTerm: string,
  sortOrder: 'asc' | 'desc' | 'dept'
): Record<string, ShoppingListItem[]> {
  // First filter items based on search term
  const filteredItems = searchTerm.trim() === '' 
    ? items 
    : items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  // Then sort based on selected sort order
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortOrder) {
      case 'asc':
        return a.name.localeCompare(b.name);
      case 'desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
  
  // Finally group by department if sort order is 'dept'
  if (sortOrder === 'dept') {
    return groupItemsByDepartment(sortedItems);
  } else {
    // Otherwise return a single group with all items
    return { 'All Items': sortedItems };
  }
}

/**
 * Get department color class
 */
export function getDepartmentColorClass(department: string): string {
  const deptLower = department.toLowerCase();
  
  if (deptLower.includes('produce') || deptLower.includes('vegetable') || deptLower.includes('fruit')) {
    return 'bg-green-100 text-green-800';
  }
  
  if (deptLower.includes('meat') || deptLower.includes('seafood') || deptLower.includes('fish')) {
    return 'bg-red-100 text-red-800';
  }
  
  if (deptLower.includes('dairy') || deptLower.includes('egg')) {
    return 'bg-blue-100 text-blue-800';
  }
  
  if (deptLower.includes('bakery') || deptLower.includes('bread')) {
    return 'bg-amber-100 text-amber-800';
  }
  
  if (deptLower.includes('pantry') || deptLower.includes('dry')) {
    return 'bg-orange-100 text-orange-800';
  }
  
  if (deptLower.includes('frozen')) {
    return 'bg-indigo-100 text-indigo-800';
  }
  
  if (deptLower.includes('beverage') || deptLower.includes('drink')) {
    return 'bg-purple-100 text-purple-800';
  }
  
  // Default
  return 'bg-muted/30';
}

/**
 * Sort departments in logical order
 */
export function sortDepartments(departments: string[]): string[] {
  // Define the priority order for departments
  const deptOrder = [
    'Produce',
    'Dairy & Eggs',
    'Meat & Seafood',
    'Bakery',
    'Pantry',
    'Canned Goods',
    'Spices',
    'Frozen',
    'Beverages',
    'Other'
  ];
  
  // Sort departments based on predefined order
  return [...departments].sort((a, b) => {
    const indexA = deptOrder.indexOf(a) >= 0 ? deptOrder.indexOf(a) : 999;
    const indexB = deptOrder.indexOf(b) >= 0 ? deptOrder.indexOf(b) : 999;
    
    // If both departments are in our predefined list, sort by that order
    if (indexA !== 999 && indexB !== 999) {
      return indexA - indexB;
    }
    
    // If one is in the list and one isn't, prioritize the one in the list
    if (indexA !== 999) return -1;
    if (indexB !== 999) return 1;
    
    // Otherwise sort alphabetically
    return a.localeCompare(b);
  });
}
