
import { ShoppingListItem } from "@/types/shopping-list";

export const toggleItem = (
  items: ShoppingListItem[],
  index: number
): ShoppingListItem[] => {
  const updatedItems = [...items];
  updatedItems[index] = {
    ...updatedItems[index],
    checked: !updatedItems[index].checked,
  };
  return updatedItems;
};

export const deleteItem = (
  items: ShoppingListItem[],
  index: number
): ShoppingListItem[] => {
  return items.filter((_, i) => i !== index);
};

export const addItem = (
  items: ShoppingListItem[],
  newItem: Partial<ShoppingListItem>
): ShoppingListItem[] => {
  if (!newItem.name?.trim()) {
    throw new Error("Item name is required");
  }

  const item: ShoppingListItem = {
    name: newItem.name.trim(),
    quantity: newItem.quantity || 1,
    unit: newItem.unit || "",
    checked: newItem.checked || false,
    department: newItem.department || "Other",
    note: newItem.note || "",
  };

  return [...items, item];
};
