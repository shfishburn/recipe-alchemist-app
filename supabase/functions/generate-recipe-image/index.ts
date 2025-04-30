
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, ingredients, instructions, recipeId } = await req.json();
    console.log('Generating image for recipe:', { title, recipeId });

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    let ingredientsDescription = Array.isArray(ingredients) 
      ? ingredients.map(ing => `${ing.qty} ${ing.unit} ${ing.item}`).join(', ')
      : "various ingredients";

    const prompt = `Create an award-winning food photograph of "${title}" that exemplifies professional culinary artistry while maintaining scientific accuracy. This dish features: ${ingredientsDescription}.

!!! CRITICAL REQUIREMENT - MUST FOLLOW !!!
- Generate ONLY photographic food imagery with NO text, words, letters, numbers, labels, graphics, charts, diagrams, or annotations of ANY kind
- The image must contain ONLY food, ingredients, dishes, tableware, and natural food styling elements
- Any text, including food labels, menu items, or recipe notes, IS STRICTLY PROHIBITED

COMPOSITION & LIGHTING:
- Photograph at a 45-degree hero angle capturing optimal surface textures and dimensional layers
- Implement split lighting technique with main light source from top-left (simulating window light) and subtle fill from right
- Create deliberate depth of field gradient (f/2.8-4.0) that prioritizes hero elements while creating atmospheric falloff
- Position on a context-appropriate surface that complements the cuisine's heritage (matte ceramic, slate, wooden board)
- Maintain negative space for visual breathing room (30% of frame) that draws attention to the focal point

CULINARY PRECISION:
- Demonstrate textbook execution of core cooking techniques (Maillard browning, proper reduction viscosity, temperature indicators)
- Capture the specific doneness markers appropriate for each ingredient (translucency, moisture content, structural integrity)
- Feature technically perfect knife work appropriate to cuisine style (brunoise, chiffonade, tourné cuts where relevant)
- Show proper emulsion stability in sauces with authentic viscosity and suspension characteristics
- Render precise cooking chemistry details (protein denaturation, starch gelatinization, fat rendering) visible in the final dish

ADVANCED STYLING:
- Incorporate 1-2 raw ingredient elements arranged naturally as visual anchors that reinforce the dish's primary components
- Apply strategic micro-garnishes that enhance color contrast and textural dynamics without overwhelming the composition
- Create intentional imperfections (scattered herbs, droplets, crumbs) that suggest freshly-plated authenticity
- Balance negative and positive space with a focal point positioned according to the golden ratio
- Include subtle environmental elements that suggest the dining context (edge of utensil, partial table setting)

The final image should appear simultaneously aspirational and achievable—a professional culinary photograph that demonstrates technical mastery while maintaining visual appeal that evokes genuine appetite response. Prioritize authentic cooking results over artificial styling techniques, with natural color grading that enhances but never exaggerates the dish's inherent characteristics.

!!! FINAL CRITICAL REMINDER !!!
THIS MUST BE PURE FOOD PHOTOGRAPHY ONLY - ABSOLUTELY NO TEXT, LETTERS, NUMBERS, GRAPHICS, CHARTS, DIAGRAMS, LABELS, CAPTIONS, ANNOTATIONS, OR ANY KIND OF TEXTUAL/GRAPHICAL ELEMENTS WHATSOEVER. VIOLATION OF THIS REQUIREMENT RENDERS THE IMAGE UNUSABLE.`;

    
    console.log('Generating image with prompt:', prompt);

    // Fix: Use the correct model and parameters for DALL-E 3
    const response = await openai.images.generate({
      model: "dall-e-3",  // Changed from "gpt-image-1" to "dall-e-3" which is the correct model name
      prompt: prompt,
      n: 1,
      size: "1792x1024",  
      quality: "hd"
    });

    if (!response.data[0]?.url) {
      throw new Error('No image URL returned from OpenAI');
    }

    console.log('Generated OpenAI image URL:', response.data[0].url);

    // Initialize Supabase client with environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration is missing');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Download the image from OpenAI and store it directly
    const imageResponse = await fetch(response.data[0].url);
    if (!imageResponse.ok) {
      throw new Error('Failed to download image from OpenAI');
    }

    const imageBlob = await imageResponse.blob();
    
    // Use the specified fileName or generate a default one
    const fileName = recipeId.includes('.png') ? recipeId : `recipe-${recipeId}-${Date.now()}.png`;

    // Upload to Supabase Storage
    console.log('Uploading image to Supabase Storage with filename:', fileName);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('recipe-images')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(uploadData.path);

    console.log('Image uploaded successfully, public URL:', publicUrl);

    // Update the recipe with the permanent image URL if recipeId is a UUID
    // but not for article slugs or custom filenames
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(recipeId);
    
    if (recipeId && isUuid) {
      console.log('Updating recipe with new image URL...');
      const { error: updateError } = await supabase
        .from('recipes')
        .update({ image_url: publicUrl })
        .eq('id', recipeId);

      if (updateError) {
        console.error('Error updating recipe:', updateError);
      } else {
        console.log('Successfully updated recipe with new image URL');
      }
    } else {
      console.log('Not updating database, recipeId is not a UUID:', recipeId);
    }

    return new Response(
      JSON.stringify({ imageUrl: publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-recipe-image function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
