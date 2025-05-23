import type { Ingredient } from './quick-recipe';
import type { Nutrition } from './recipe';

export interface ChangesResponse {
  title?: string;
  ingredients?: {
    mode: "add" | "replace" | "none";
    items?: Ingredient[];
  };
  instructions?: string[];
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
}

export type OptimisticMessage = Partial<ChatMessage> & {
  user_message: string;
  id: string;
  meta?: ChatMeta;
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
