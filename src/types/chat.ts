
import { QuickRecipe } from './quick-recipe';
import { Recipe } from './recipe';

export interface ChatMeta {
  [key: string]: unknown;
  recipe_id?: string;
  version_id?: string;
  optimistic_id?: string;
  tracking_id?: string;
  processing_stage?: 'pending' | 'processing' | 'complete' | 'error';
  timestamp?: number;
}

export interface ChatMessage {
  id: string;
  recipe_id?: string;
  user_message?: string;
  ai_response?: string;
  changes_suggested?: ChangesResponse;
  source_type?: string;
  source_url?: string;
  source_image?: string;
  meta?: ChatMeta;
  timestamp?: number;
  created_at?: string;
  
  // New field to support the complete recipe object
  recipe?: Recipe | QuickRecipe;
  
  // Add missing properties that the components expect
  applied?: boolean;
  follow_up_questions?: string[];
}

// Updated ChangesResponse type with proper typing for ingredients and other fields
export interface ChangesResponse {
  title?: string | null;
  ingredients?: {
    mode: 'add' | 'replace' | 'none';
    items: IngredientChange[];
  };
  instructions?: string[] | InstructionChange[];
  science_notes?: string[];
  nutrition?: Record<string, unknown>;
  [key: string]: unknown;
}

// New interface for ingredient changes
export interface IngredientChange {
  qty: number;
  unit: string;
  item: string;
  notes?: string;
  action?: string;
  [key: string]: unknown;
}

// New interface for instruction changes
export interface InstructionChange {
  text: string;
  action?: string;
  [key: string]: unknown;
}

export interface OptimisticMessage extends Partial<ChatMessage> {
  id: string;
  recipe_id?: string;
  pending: boolean;
  content?: string;
  meta?: ChatMeta;
  timestamp: number;
  // Added missing properties
  applied?: boolean;
  follow_up_questions?: string[];
}
