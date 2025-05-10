
import { useAuth } from '@/hooks/use-auth';

// Get simple ingredient name (first word)
export const getSimpleIngredientName = (mainIngredient?: string) => {
  if (!mainIngredient) return 'recipe';
  const firstWord = mainIngredient.split(' ')[0];
  return firstWord.toLowerCase();
};

// Personalized message
export const getUserMessage = (mainIngredient?: string, userName?: string | null) => {
  const ingredient = getSimpleIngredientName(mainIngredient);
  
  if (userName) {
    return `Creating ${ingredient} recipe for ${userName}`;
  }
  
  return `Creating your ${ingredient} recipe`;
};

// Hook to get user message
export const useUserMessage = (mainIngredient?: string) => {
  const { session } = useAuth();
  const userName = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0];
  return getUserMessage(mainIngredient, userName);
};
