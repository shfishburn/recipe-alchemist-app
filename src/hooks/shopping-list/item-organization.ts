
import type { ShoppingListItem } from '@/types/shopping-list';

/**
 * Groups shopping list items by department
 */
export const groupItemsByDepartment = (items: ShoppingListItem[]) => {
  // Filter out water items
  const filteredItems = items.filter(item => 
    !item.name.toLowerCase().trim().match(/^water$/)
  );
  
  // Capitalize each item's name
  const capitalizedItems = filteredItems.map(item => ({
    ...item,
    name: capitalizeName(item.name)
  }));
  
  // Group by department
  return capitalizedItems.reduce((acc, item) => {
    const dept = item.department || 'Other';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(item);
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);
};

/**
 * Organizes items according to search and sort criteria
 */
export const organizeItems = (
  items: ShoppingListItem[],
  searchTerm: string,
  sortOrder: 'asc' | 'desc' | 'dept'
): Record<string, ShoppingListItem[]> => {
  // Filter out water items first
  const filteredItems = items.filter(item => 
    !item.name.toLowerCase().trim().match(/^water$/)
  );
  
  // Filter by search term if provided
  const searchFilteredItems = searchTerm.trim() === '' 
    ? filteredItems
    : filteredItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  // Sort items
  const sortedItems = [...searchFilteredItems].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === 'desc') {
      return b.name.localeCompare(a.name);
    }
    // For 'dept', return 0 as we'll handle grouping separately
    return 0;
  });
  
  // Capitalize all item names
  const capitalizedItems = sortedItems.map(item => ({
    ...item,
    name: capitalizeName(item.name)
  }));
  
  // Group by department or return as "All Items" for non-department sorting
  return sortOrder === 'dept' 
    ? groupItemsByDepartment(capitalizedItems) 
    : {
        'All Items': capitalizedItems
      };
};

/**
 * Capitalize the first letter of each word in a string
 */
export const capitalizeName = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
