
export type ShoppingListItem = {
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  notes?: string;
  quality_indicators?: string;
  alternatives?: string[];
  pantry_staple?: boolean;
  storage_tips?: string;
  department?: string;
  recipeId?: string;
  // New fields for shoppable quantities
  shop_size_qty?: number;
  shop_size_unit?: string;
};

export type ShoppingList = {
  id: string;
  title: string;
  items: ShoppingListItem[];
  tips?: string[];
  preparation_notes?: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
  deleted_at?: string;
};

export type ShoppingListSummary = {
  id: string;
  title: string;
};
