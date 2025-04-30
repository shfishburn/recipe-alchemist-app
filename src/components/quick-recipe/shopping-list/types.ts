
// Define the item type for shopping list
export interface ShoppingItem {
  text: string;
  checked: boolean;
  department: string;
  pantryStaple?: boolean;
}

export interface ShoppingItemsByDepartment {
  [department: string]: ShoppingItem[];
}
