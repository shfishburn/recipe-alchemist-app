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
 * Sort and filter items by search term and sort order
 */
export function organizeItems(
  items: ShoppingListItem[], 
  searchTerm: string,
  sortOrder: 'asc' | 'desc' | 'dept'
): Record<string, ShoppingListItem[]> {
  // Filter items by search term
  const filteredItems = searchTerm.trim() === '' 
    ? items 
    : items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  // For 'asc' and 'desc' sort orders, group all items together
  if (sortOrder === 'asc' || sortOrder === 'desc') {
    const sortedItems = [...filteredItems].sort((a, b) => {
      return sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
    
    return { 'All Items': sortedItems };
  }
  
  // For 'dept', group by department
  return groupItemsByDepartment(filteredItems);
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
