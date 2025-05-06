
import { supabase } from '@/integrations/supabase/client';
import type { QuickRecipe } from '@/hooks/use-quick-recipe';
import type { AIResponse } from '@/types/chat';

// Function to generate a response for a quick recipe chat
export const generateQuickRecipeResponse = async (
  recipe: QuickRecipe, 
  message: string
): Promise<AIResponse> => {
  try {
    console.log("Generating quick recipe chat response");
    
    // Call the edge function
    const response = await supabase.functions.invoke('recipe-chat', {
      body: { 
        recipe,
        userMessage: message,
        sourceType: 'preview'
      }
    });
    
    if (response.error) {
      console.error('Error in generateQuickRecipeResponse:', response.error);
      throw new Error(response.error.message || 'Failed to get AI response');
    }
    
    if (!response.data) {
      throw new Error('No data returned from recipe chat function');
    }
    
    // Extract data from the response
    const { textResponse, changes } = response.data;
    
    if (!textResponse) {
      throw new Error('Invalid response format from AI');
    }
    
    return {
      textResponse,
      changes: changes || null,
      followUpQuestions: response.data.followUpQuestions || []
    };
  } catch (error: any) {
    console.error('Error in generateQuickRecipeResponse:', error);
    
    // Try to craft a meaningful error response
    if (error.message?.includes('timeout')) {
      throw new Error('Request timed out. Please try again.');
    }
    
    throw error;
  }
};

// Fallback implementation for use in development or when edge function fails
export const generateFallbackResponse = (
  recipe: QuickRecipe,
  message: string
): AIResponse => {
  return {
    textResponse: "I'm currently unable to analyze this recipe in detail. Please try again later.",
    changes: null,
    followUpQuestions: [
      "Would you like me to suggest alternative ingredients?",
      "Do you have any dietary restrictions I should know about?",
      "Would you like to adjust the cooking time or temperature?"
    ]
  };
};
