
import { ShoppingListItem } from "@/types/shopping-list";

// Helper function to organize items based on search term and sort order
export const organizeItems = (
  items: ShoppingListItem[],
  searchTerm: string,
  sortOrder: 'asc' | 'desc' | 'dept'
): ShoppingListItem[] => {
  // Filter by search term if provided
  let filteredItems = items;
  
  if (searchTerm.trim()) {
    const search = searchTerm.toLowerCase().trim();
    filteredItems = items.filter(item => 
      item.name.toLowerCase().includes(search) ||
      (item.note && item.note.toLowerCase().includes(search))
    );
  }
  
  // Sort items according to selected sort order
  if (sortOrder === 'asc') {
    return [...filteredItems].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === 'desc') {
    return [...filteredItems].sort((a, b) => b.name.localeCompare(a.name));
  } else {
    // First group by department, then sort alphabetically within each department
    return [...filteredItems].sort((a, b) => {
      const deptA = a.department || 'Other';
      const deptB = b.department || 'Other';
      
      if (deptA === deptB) {
        return a.name.localeCompare(b.name);
      }
      
      return deptA.localeCompare(deptB);
    });
  }
};
