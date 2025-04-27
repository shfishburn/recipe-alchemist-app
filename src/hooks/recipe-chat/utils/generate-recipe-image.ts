
import { supabase } from '@/integrations/supabase/client';

export async function generateRecipeImage(
  title: string,
  ingredients: Array<{ qty: number; unit: string; item: string; }>,
  instructions: string[]
) {
  try {
    const response = await supabase.functions.invoke('generate-recipe-image', {
      body: { title, ingredients, instructions },
    });

    if (response.error) throw response.error;
    return response.data.imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}
