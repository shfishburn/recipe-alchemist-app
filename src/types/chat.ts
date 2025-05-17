
import { QuickRecipe } from './quick-recipe';

export interface SuggestedChanges {
  // Title changes
  title?: string;
  
  // Description changes
  description?: string;
  
  // Ingredient changes
  ingredients?: {
    mode: 'none' | 'add' | 'replace' | 'update';
    items?: Array<{
      qty: number;
      unit: string;
      item: string;
      action?: 'add' | 'update' | 'remove';
      original?: string;
    }>;
  };
  
  // Instruction changes
  instructions?: Array<string | InstructionChange>;
  
  // Nutrition changes
  nutrition?: Record<string, any>;
  
  // Science notes
  science_notes?: string[];
  
  // Cooking tips
  cooking_tip?: string;
  chef_notes?: string;
  
  // Complete recipe replacement (newer API returns full recipe)
  recipe?: QuickRecipe;
}

export interface InstructionChange {
  action: string;
  original?: string;
}

export interface ChatMessage {
  id: string;
  user_message: string;
  ai_response: string;
  changes_suggested: SuggestedChanges;
  meta?: Record<string, any>;
  applied?: boolean;
  timestamp?: number;
}

export interface OptimisticMessage {
  id: string;
  user_message: string;
  ai_response?: string;
  meta?: Record<string, any>;
}
