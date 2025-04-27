
export type ShoppingListItem = {
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
};

export type ShoppingList = {
  id: string;
  title: string;
  items: ShoppingListItem[];
  created_at: string;
  updated_at: string;
  user_id: string;
};

// Type for partial shopping list data when only id and title are needed
export type ShoppingListSummary = {
  id: string;
  title: string;
};
