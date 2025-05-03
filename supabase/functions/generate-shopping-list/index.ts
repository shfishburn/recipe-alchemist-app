
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.0.0";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ingredients, title } = await req.json();

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const openai = new OpenAI({ apiKey });

    // Process ingredients to include shopping size info when available
    const ingredientsText = Array.isArray(ingredients) 
      ? ingredients.map(ing => {
          // Always prioritize shop sizes if available
          const qty = ing.shop_size_qty !== undefined ? ing.shop_size_qty : ing.qty;
          const unit = ing.shop_size_unit || ing.unit;
          
          // Handle different item formats
          let itemName = '';
          if (typeof ing.item === 'string') {
            itemName = ing.item;
          } else if (ing.item && typeof ing.item === 'object') {
            if (ing.item.item && typeof ing.item.item === 'string') {
              itemName = ing.item.item;
            } else {
              itemName = JSON.stringify(ing.item);
            }
          }
          
          const notes = ing.notes || '';
          
          return `${qty} ${unit} ${itemName}${notes ? ` (${notes})` : ''}`;
        }).join('\n')
      : "No ingredients provided";

    const prompt = `As a professional chef specializing in culinary science and practical shopping, organize these ingredients from the recipe "${title}" into an optimized shopping list with expert insights.

Input ingredients:
${ingredientsText}

ORGANIZATION PRINCIPLES:
1. Group ingredients by store department (Produce, Meat, Dairy, Pantry, Specialty, etc.)
2. Combine identical ingredients with mathematical precision and adjust quantities
3. Standardize measurement units for consistency using imperial units only
4. Prioritize ingredients by cooking sequence and perishability
5. Flag items needing advance preparation or special handling

MEASUREMENT STANDARDIZATION:
- All measurements MUST be in imperial units (oz, lb, cups, tbsp, tsp, inches, °F)
- Convert any metric values to their imperial equivalents
- For small quantities where precision matters, use fractions (1/4 tsp, etc.)
- Ensure consistent units across similar ingredients
- Round measurements to practical shopping quantities

PRACTICAL ENHANCEMENTS:
1. Identify quality indicators for key ingredients (e.g., "ripe but firm avocados")
2. Note seasonal availability and suggest peak-season alternatives
3. Include substitutions for dietary restrictions (gluten-free, dairy-free, etc.)
4. Add commonly needed companion ingredients missing from the recipe
5. Suggest precise quantity purchasing to minimize waste (e.g., "buy 1 bunch for 2 tbsp needed")

SHOPPING EFFICIENCY:
1. Mark ingredients that could already exist in a well-stocked pantry
2. Indicate ingredients that can be bought in bulk vs. fresh
3. Note ingredients with significant price variations between brands/sources
4. Suggest preservation methods for unused portions
5. Flag ingredients that require special storage after purchase

SHOPPABLE QUANTITY RULES:
1. ALWAYS provide realistic purchasable quantities in shop_size_qty and shop_size_unit
2. For shop_size_unit, ONLY use standard retail units (oz, lb, each, bunch, package, bottle, can, etc.)
3. shop_size_qty MUST be a number, not a range or description
4. NEVER use vague terms like "small container" or "medium package" - be specific with units
5. Round to standard package sizes available in stores (e.g. 16 oz, 1 lb, 5 lb)

Return ONLY valid JSON matching this schema:
{
  "departments": [{
    "name": string,
    "items": [{
      "name": string,
      "quantity": number,
      "unit": string,
      "shop_size_qty": number,
      "shop_size_unit": string,
      "notes": string,
      "quality_indicators": string,
      "alternatives": string[],
      "pantry_staple": boolean,
      "storage_tips": string
    }]
  }],
  "efficiency_tips": string[],
  "preparation_notes": string[]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a professional chef helping organize shopping lists." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const shoppingList = JSON.parse(response.choices[0].message.content);
    return new Response(JSON.stringify(shoppingList), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating shopping list:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
