
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeadersWithOrigin } from "../_shared/cors.ts";

// Constants
const BASE_URL = "https://api.nal.usda.gov/fdc/v1";

// Main serve function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      headers: getCorsHeadersWithOrigin(req)
    });
  }

  try {
    // Get API key from environment
    const apiKey = Deno.env.get("USDA_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "USDA API key not configured" }),
        { 
          status: 500, 
          headers: { ...getCorsHeadersWithOrigin(req), "Content-Type": "application/json" } 
        }
      );
    }

    // Parse request body
    const requestBody = await req.json();
    const { method, query, fdcId, pageSize = 10, pageNumber = 1 } = requestBody;

    // Different methods for different operations
    let responseData;
    
    switch (method) {
      case "search":
        responseData = await searchFoods(apiKey, query, pageSize, pageNumber);
        break;
      case "get-food":
        responseData = await getFood(apiKey, fdcId);
        break;
      case "import-food":
        responseData = await importFood(apiKey, fdcId);
        break;
      default:
        return new Response(
          JSON.stringify({ error: "Invalid method specified" }),
          { 
            status: 400, 
            headers: { ...getCorsHeadersWithOrigin(req), "Content-Type": "application/json" } 
          }
        );
    }

    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { ...getCorsHeadersWithOrigin(req), "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in USDA Food API function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred processing your request" }),
      { 
        status: 500, 
        headers: { ...getCorsHeadersWithOrigin(req), "Content-Type": "application/json" } 
      }
    );
  }
});

// Search for foods
async function searchFoods(apiKey: string, query: string, pageSize: number, pageNumber: number) {
  const url = new URL(`${BASE_URL}/foods/search`);
  url.searchParams.append("api_key", apiKey);
  url.searchParams.append("query", query);
  url.searchParams.append("pageSize", pageSize.toString());
  url.searchParams.append("pageNumber", pageNumber.toString());
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`USDA API returned status ${response.status}`);
  }
  
  return await response.json();
}

// Get specific food details
async function getFood(apiKey: string, fdcId: string) {
  const url = new URL(`${BASE_URL}/food/${fdcId}`);
  url.searchParams.append("api_key", apiKey);
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`USDA API returned status ${response.status}`);
  }
  
  return await response.json();
}

// Import food data into our database
async function importFood(apiKey: string, fdcId: string) {
  // First, get the complete food data
  const foodData = await getFood(apiKey, fdcId);
  
  // Process the data into our database format
  const processedFood = {
    food_code: foodData.fdcId.toString(),
    food_name: foodData.description,
    calories: extractNutrientValue(foodData, "Energy"),
    protein_g: extractNutrientValue(foodData, "Protein"),
    carbs_g: extractNutrientValue(foodData, "Carbohydrate, by difference"),
    fat_g: extractNutrientValue(foodData, "Total lipid (fat)"),
    fiber_g: extractNutrientValue(foodData, "Fiber, total dietary"),
    sugar_g: extractNutrientValue(foodData, "Sugars, total including NLEA"),
    sodium_mg: extractNutrientValue(foodData, "Sodium, Na"),
    potassium_mg: extractNutrientValue(foodData, "Potassium, K"),
    calcium_mg: extractNutrientValue(foodData, "Calcium, Ca"),
    iron_mg: extractNutrientValue(foodData, "Iron, Fe"),
    vitamin_a_iu: extractNutrientValue(foodData, "Vitamin A, IU"),
    vitamin_c_mg: extractNutrientValue(foodData, "Vitamin C, total ascorbic acid"),
    vitamin_d_iu: extractNutrientValue(foodData, "Vitamin D (D2 + D3), International Units"),
    metadata: { 
      originalData: foodData,
      importDate: new Date().toISOString() 
    }
  };
  
  // For now, just return the processed data
  // In a real implementation, you would save this to the database
  return {
    success: true,
    processedFood
  };
}

// Helper function to extract nutrient values
function extractNutrientValue(foodData: any, nutrientName: string): number | null {
  if (!foodData.foodNutrients) return null;
  
  const nutrient = foodData.foodNutrients.find(
    (n: any) => n.nutrient?.name === nutrientName
  );
  
  return nutrient ? nutrient.amount : null;
}
