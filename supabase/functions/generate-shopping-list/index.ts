import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeadersWithOrigin } from "../_shared/cors.ts";

// Define interfaces
interface Ingredient {
  item: string;
  qty_metric?: number;
  qty_imperial?: number;
  qty?: number;
  unit_metric?: string;
  unit_imperial?: string;
  unit?: string;
  notes?: string;
  shop_size_qty?: number;
  shop_size_unit?: string;
}

interface Recipe {
  id: string;
  title: string;
  ingredients: Ingredient[];
  servings: number;
}

interface ShoppingListItem {
  id: string;
  ingredient: string;
  quantity: number;
  unit: string;
  purchased: boolean;
  recipe_source?: {
    id: string;
    title: string;
    servings: number;
    original_qty: number;
    original_unit: string;
  }
  category?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      headers: getCorsHeadersWithOrigin(req) 
    });
  }

  try {
    // Parse request body
    const { recipes } = await req.json();
    
    if (!Array.isArray(recipes) || recipes.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid request: recipes array is required" }),
        { status: 400, headers: { ...getCorsHeadersWithOrigin(req), "Content-Type": "application/json" } }
      );
    }

    // Generate the shopping list
    const shoppingItems: ShoppingListItem[] = [];
    const ingredientMap = new Map<string, ShoppingListItem>();
    
    // Process each recipe and combine ingredients
    recipes.forEach((recipe: Recipe) => {
      if (!recipe.ingredients) return;
      
      recipe.ingredients.forEach((ingredient) => {
        // Skip ingredients without name
        if (!ingredient.item) return;
        
        // Normalize the ingredient key for consolidation
        const normalizedName = ingredient.item.toLowerCase().trim();
        const qty = ingredient.qty || ingredient.qty_metric || ingredient.qty_imperial || 0;
        const unit = ingredient.unit || ingredient.unit_metric || ingredient.unit_imperial || "";
        
        // Create or update shopping list item
        if (ingredientMap.has(normalizedName)) {
          // Update existing item
          const existingItem = ingredientMap.get(normalizedName)!;
          
          if (existingItem.unit === unit) {
            // Same unit - add quantities
            existingItem.quantity += qty;
          } else {
            // Different unit - keep as is, but note in the source
            existingItem.recipe_source!.original_qty = qty;
            existingItem.recipe_source!.original_unit = unit;
          }
          
        } else {
          // Create new shopping list item
          const newItem: ShoppingListItem = {
            id: crypto.randomUUID(),
            ingredient: ingredient.item,
            quantity: qty,
            unit: unit,
            purchased: false,
            recipe_source: {
              id: recipe.id,
              title: recipe.title,
              servings: recipe.servings || 1,
              original_qty: qty,
              original_unit: unit
            }
          };
          
          ingredientMap.set(normalizedName, newItem);
          shoppingItems.push(newItem);
        }
      });
    });

    // Sort items alphabetically
    shoppingItems.sort((a, b) => a.ingredient.localeCompare(b.ingredient));

    return new Response(
      JSON.stringify({
        items: shoppingItems,
        meta: {
          recipe_count: recipes.length,
          item_count: shoppingItems.length,
          generated_at: new Date().toISOString(),
        }
      }),
      { status: 200, headers: { ...getCorsHeadersWithOrigin(req), "Content-Type": "application/json" } }
    );
    
  } catch (err) {
    console.error("Error generating shopping list:", err);
    
    return new Response(
      JSON.stringify({ error: "Failed to generate shopping list", details: String(err) }),
      { status: 500, headers: { ...getCorsHeadersWithOrigin(req), "Content-Type": "application/json" } }
    );
  }
});
