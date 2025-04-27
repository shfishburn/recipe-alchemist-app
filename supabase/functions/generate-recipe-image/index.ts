
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    let ingredientsDescription = Array.isArray(ingredients) 
      ? ingredients.map(ing => `${ing.qty} ${ing.unit} ${ing.item}`).join(', ')
      : "various ingredients";

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

    if (!response.data[0].url) {
      throw new Error('No image URL returned from OpenAI');
    }

    console.log('Generated OpenAI image URL:', response.data[0].url);

    // Download the image from OpenAI
    const imageResponse = await fetch(response.data[0].url);
    if (!imageResponse.ok) {
      throw new Error('Failed to download image from OpenAI');
    }

    const imageBlob = await imageResponse.blob();
    const fileName = `recipe-${recipeId}-${Date.now()}.png`;

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

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
