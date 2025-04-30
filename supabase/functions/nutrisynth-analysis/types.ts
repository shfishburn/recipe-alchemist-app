
export interface Ingredient {
  qty: number;
  unit: string;
  item: string | { item: string };
  note?: string;
}
