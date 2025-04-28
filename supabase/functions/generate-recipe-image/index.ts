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

    const prompt = `Create a professional, appetizing photo of "${title}" that showcases both visual appeal and culinary technique. This dish contains ${ingredientsDescription}.

VISUAL STYLE:
- Professional food photography with 45-degree angled perspective (showing both top and side)
- Natural, directional lighting from top-left with soft shadows for depth
- Shallow depth of field focusing on key textural elements
- Set on a neutral ceramic or slate surface with minimal props
- Color harmony highlighting the dish's dominant ingredients

CULINARY ACCURACY:
- Show scientifically correct cooking results (proper caramelization, appropriate doneness)
- Capture texture contrasts (crispy/tender, moist/dry) based on the cooking techniques
- Display proper garnish placement that enhances visual appeal
- Demonstrate proper knife work and cutting techniques for ingredients
- Include appropriate steam/moisture where relevant for freshness indicators

FOOD STYLING DETAILS:
- Include 1-2 complementary ingredients in background (whole forms of processed ingredients)
- Show proper plating technique appropriate for cuisine style
- Display correct sauce consistency and application
- Capture appropriate portion size on properly scaled dishware
- Include small details that suggest freshness (droplets, herb oils, textural variations)

The image should appear professionally styled but achievable, with natural colors and textures that accurately represent the dish's scientific preparation methods.`;

    console.log('Generating image with prompt:', prompt);

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural",
    });

    if (!response.data[0].url) {
      throw new Error('No image URL returned from OpenAI');
    }

    console.log('Generated OpenAI image URL:', response.data[0].url);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Download the image from OpenAI and store it directly
    const imageResponse = await fetch(response.data[0].url);
    if (!imageResponse.ok) {
      throw new Error('Failed to download image from OpenAI');
    }

    const imageBlob = await imageResponse.blob();
    const fileName = `recipe-${recipeId}-${Date.now()}.png`;

    // Upload to Supabase Storage
    console.log('Uploading image to Supabase Storage...');
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

    // Update the recipe with the permanent image URL
    if (recipeId) {
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
    }

    return new Response(
      JSON.stringify({ imageUrl: publicUrl }),
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
