
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { uploadImageFromUrl } from '@/utils/image-storage';

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

    console.log('Generated image URL:', response.data[0].url);

    // Upload the image to our storage bucket
    const fileName = `recipe-${recipeId}-${Date.now()}.png`;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Download and upload to our bucket
    const imageResponse = await fetch(response.data[0].url);
    const imageBlob = await imageResponse.blob();
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('recipe-images')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading to storage:', uploadError);
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(uploadData.path);

    // Update the recipe with the new image URL
    if (recipeId) {
      const { error: updateError } = await supabase
        .from('recipes')
        .update({ image_url: publicUrl })
        .eq('id', recipeId);

      if (updateError) {
        console.error('Error updating recipe:', updateError);
        throw updateError;
      }
      console.log('Successfully updated recipe with new image URL');
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
