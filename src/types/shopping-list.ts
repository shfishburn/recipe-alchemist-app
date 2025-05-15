
export interface ShoppingListItem {
  id?: string;
  name: string;
  quantity?: number;
  unit?: string;
  checked?: boolean;
  department?: string;
  note?: string;
}

export interface ShoppingList {
  id: string;
  title: string;
  items: ShoppingListItem[];
  created_at: string;
  updated_at?: string;
  user_id: string;
}
