
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, ingredients, instructions } = await req.json();

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    // Parse ingredients array if it's a string
    let ingredientsList = ingredients;
    
    // Create a descriptive prompt for the recipe
    let ingredientsDescription;
    
    // If ingredients is an array, extract details
    if (Array.isArray(ingredientsList)) {
      ingredientsDescription = ingredientsList.map(ing => 
        `${ing.qty} ${ing.unit} ${ing.item}`
      ).join(', ');
    } else {
      // If ingredients was sent as a string, try to parse it
      try {
        const parsedIngredients = JSON.parse(ingredientsList);
        if (Array.isArray(parsedIngredients)) {
          ingredientsDescription = parsedIngredients.map(ing => 
            `${ing.qty} ${ing.unit} ${ing.item}`
          ).join(', ');
        } else {
          ingredientsDescription = "various ingredients";
        }
      } catch (e) {
        // If parsing fails, use a generic description
        ingredientsDescription = "various ingredients";
        console.log("Error parsing ingredients:", e);
      }
    }

    const prompt = `Create a professional, appetizing photo of "${title}". This dish contains ${ingredientsDescription}. Style: Modern food photography, overhead view, natural lighting, on a white plate with minimal garnish. Make it look delicious and Instagram-worthy.`;

    console.log('Generating image with prompt:', prompt);

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural",
    });

    console.log('Generated image URL:', response.data[0].url);

    return new Response(
      JSON.stringify({ imageUrl: response.data[0].url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating image:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
