
// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client with environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const openaiApiKey = Deno.env.get('OPENAI_API_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Function to fetch reference images from the web using a simple search
async function fetchReferenceImages(query: string): Promise<string[]> {
  try {
    // Craft a search query
    const searchQuery = `food photography ${query} recipe dish cuisine professional`;
    
    // This is a placeholder that would normally use a search API
    // For now, we'll just return a simple acknowledgment
    console.log(`Reference image search for: ${searchQuery}`);
    
    return [];
  } catch (error) {
    console.error('Error fetching reference images:', error);
    return [];
  }
}

// Function to generate a prompt for DALL-E based on recipe details
function generateImagePrompt(
  title: string, 
  ingredients: any[], 
  instructions: string[],
  guidance?: string,
  referenceUrl?: string
): string {
  // Extract key ingredients
  let keyIngredients = '';
  if (ingredients && Array.isArray(ingredients)) {
    keyIngredients = ingredients
      .slice(0, 5)
      .map((ing) => (typeof ing === 'string' ? ing : ing.item || ''))
      .filter(Boolean)
      .join(', ');
  }
  
  // Build a base prompt
  let prompt = `Create a professional, high-resolution food photograph of ${title}.`;
  
  // Add ingredients detail if available
  if (keyIngredients) {
    prompt += ` It includes ${keyIngredients}.`;
  }

  // Add cooking style from instructions if available
  if (instructions && instructions.length > 0) {
    const cookingMethods = [
      'baked', 'roasted', 'grilled', 'sautéed', 'fried', 
      'steamed', 'boiled', 'poached', 'simmered', 'broiled'
    ];
    
    const cookingText = instructions.join(' ').toLowerCase();
    const foundMethod = cookingMethods.find(method => cookingText.includes(method));
    
    if (foundMethod) {
      prompt += ` The dish is ${foundMethod}.`;
    }
  }

  // Add styling for the food photo
  prompt += ` The dish should be beautifully plated on an elegant table setting with perfect lighting and depth of field. High-end food magazine quality with natural looking colors.`;
  
  // Add user customization guidance if provided
  if (guidance) {
    prompt += ` ${guidance}`;
  }
  
  // Add reference to the provided URL if available
  if (referenceUrl) {
    prompt += ` Use the style and composition similar to the reference image.`;
  }
  
  return prompt;
}

// Function to upload an image to storage
async function uploadImageToStorage(
  imageUrl: string,
  recipeId: string
): Promise<string> {
  try {
    // Create a unique filename with timestamp
    const timestamp = new Date().getTime();
    const filename = `${recipeId}-${timestamp}.png`;
    
    // Fetch the image content
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error('Failed to fetch generated image');
    const imageBlob = await imageResponse.blob();
    
    // Upload to Storage
    const { data, error } = await supabase
      .storage
      .from('recipe-images')
      .upload(filename, imageBlob, {
        contentType: 'image/png',
        upsert: false
      });
    
    if (error) throw error;
    
    // Get the public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('recipe-images')
      .getPublicUrl(data.path);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Function to update recipe with new image URL
async function updateRecipeImage(
  recipeId: string,
  imageUrl: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('recipes')
      .update({ image_url: imageUrl })
      .eq('id', recipeId);
    
    if (error) throw error;
    
    console.log(`Recipe ${recipeId} updated with new image: ${imageUrl}`);
  } catch (error) {
    console.error('Error updating recipe image URL:', error);
    throw error;
  }
}

// Main function to handle the request
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request body
    const requestData = await req.json();
    const { 
      title, 
      ingredients, 
      instructions, 
      recipeId, 
      guidance,
      referenceUrl,
      useWebSearch 
    } = requestData;
    
    if (!title) {
      throw new Error('Recipe title is required');
    }
    
    console.log(`Generating image for recipe: ${title}`);
    
    // Check if we need to fetch reference images
    let referenceImages: string[] = [];
    if (useWebSearch) {
      referenceImages = await fetchReferenceImages(title);
    }
    
    // Generate the prompt
    const prompt = generateImagePrompt(title, ingredients, instructions, guidance, referenceUrl);
    console.log('Generated prompt:', prompt);
    
    // Call OpenAI API to generate image
    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      })
    });
    
    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }
    
    const openaiData = await openaiResponse.json();
    console.log('DALL-E response received');
    
    // Get the URL of the generated image
    const generatedImageUrl = openaiData.data[0].url;
    console.log('Generated image URL:', generatedImageUrl);
    
    let publicImageUrl;
    if (recipeId) {
      // Upload to storage
      publicImageUrl = await uploadImageToStorage(generatedImageUrl, recipeId);
      
      // Update recipe with the new image URL
      await updateRecipeImage(recipeId, publicImageUrl);
    } else {
      // If no recipeId provided, just return the generated URL
      publicImageUrl = generatedImageUrl;
    }
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: publicImageUrl 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error generating recipe image:', error);
    
    // Return error response
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500
      }
    );
  }
});
