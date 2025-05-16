
import type { Ingredient } from './quick-recipe';
import type { Nutrition } from './recipe';

// Define the instruction change interface to properly type instructions
export interface InstructionChange {
  action: string;
  step?: number;
  details?: string;
}

export interface ChangesResponse {
  title?: string;
  ingredients?: {
    mode: "add" | "replace" | "none";
    items?: Ingredient[];
  };
  instructions?: Array<string | InstructionChange>;
  science_notes?: string[];
  nutrition?: Nutrition;
}

export interface ChatMessage {
  id: string;
  user_message: string;
  ai_response: string;
  changes_suggested?: ChangesResponse | null;
  follow_up_questions?: string[];
  meta?: ChatMeta;
  timestamp?: number;
  recipe_id?: string;
  recipe?: any; // For full recipe updates
  applied?: boolean;
  version_id?: string;
  pending?: boolean;
  created_at?: string; // Adding this to fix type issues
}

export type OptimisticMessage = Omit<Partial<ChatMessage>, 'user_message' | 'id'> & {
  user_message: string;
  id: string;
  meta?: ChatMeta;
  ai_response?: string; // Make this optional to match the usage
};

export interface ChatMeta {
  [key: string]: any;
  optimistic_id?: string;
  error?: boolean;
  error_details?: string;
  processing_stage?: string;
  timestamp?: number;
  tracking_id?: string;
  recipe_id?: string;
}
