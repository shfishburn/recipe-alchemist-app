
import { supabase } from '@/integrations/supabase/client';

export async function generateRecipeImage(
  title: string,
  ingredients: Array<{ qty: number; unit: string; item: string; }>,
  instructions: string[],
  recipeId?: string
) {
  try {
    console.log('Calling generate-recipe-image function with:', { title, ingredients, instructions, recipeId });
    
    const response = await supabase.functions.invoke('generate-recipe-image', {
      body: { title, ingredients, instructions, recipeId },
    });

    if (response.error) {
      console.error('Error from generate-recipe-image function:', response.error);
      throw response.error;
    }

    if (!response.data?.imageUrl) {
      console.error('No image URL in response:', response);
      throw new Error('No image URL returned from generation');
    }

    console.log('Successfully generated image:', response.data.imageUrl);
    return response.data.imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error; // Let the caller handle the error
  }
}
