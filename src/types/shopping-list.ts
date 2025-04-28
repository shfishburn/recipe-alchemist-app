
export type ShoppingListItem = {
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  notes?: string;
  alternatives?: string[];
  pantry_staple?: boolean;
  department?: string;
  recipeId?: string;
};

export type ShoppingList = {
  id: string;
  title: string;
  items: ShoppingListItem[];
  tips?: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
};

export type ShoppingListSummary = {
  id: string;
  title: string;
};
