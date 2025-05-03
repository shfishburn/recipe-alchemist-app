
import { ShoppingListItem } from '@/types/shopping-list';

// Group items by department
export function groupItemsByDepartment(items: ShoppingListItem[]): Record<string, ShoppingListItem[]> {
  return items.reduce((acc, item) => {
    const dept = item.department || 'Other';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(item);
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);
}

// Filter items by search term
export function filterItemsBySearchTerm(items: ShoppingListItem[], searchTerm: string): ShoppingListItem[] {
  if (searchTerm.trim() === '') {
    return items;
  }
  
  return items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

// Sort items by name
export function sortItemsByName(items: ShoppingListItem[], sortOrder: 'asc' | 'desc'): ShoppingListItem[] {
  return [...items].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });
}

// Group items based on sort order
export function organizeItems(
  items: ShoppingListItem[], 
  searchTerm: string, 
  sortOrder: 'asc' | 'desc' | 'dept'
): Record<string, ShoppingListItem[]> {
  // First filter by search term
  const filteredItems = filterItemsBySearchTerm(items, searchTerm);
  
  // Then handle organization based on sort order
  if (sortOrder === 'dept') {
    // Group by department
    return groupItemsByDepartment(filteredItems);
  } else {
    // Sort by name and return under 'All Items' category
    const sortedItems = sortItemsByName(filteredItems, sortOrder);
    return {
      'All Items': sortedItems
    };
  }
}
