
import type { Json } from "@/integrations/supabase/types";
import type { Recipe } from "./recipe";

export interface ChatMeta {
  optimistic_id?: string;
  is_retry?: boolean;
  processed_at?: string;
  [key: string]: any;
}

export interface ChatMessage {
  id: string;
  created_at?: string;
  recipe_id?: string;
  user_message: string;
  ai_response: string;
  changes_suggested?: {
    title?: string;
    ingredients?: {
      mode: "replace" | "add" | "none";
      items: Array<any>;
    };
    instructions?: string[];
    nutrition?: Record<string, any>;
    science_notes?: string[];
  };
  source_type?: string;
  source_url?: string;
  source_image?: string;
  meta?: ChatMeta;
  version_id?: string;
  applied?: boolean;
  recipe?: Recipe | Partial<Recipe>; // Add support for complete recipe objects
}

export interface OptimisticMessage {
  id: string;
  user_message: string;
  pending?: boolean;
  ai_response?: string;
  meta?: ChatMeta;
  changes_suggested?: ChatMessage['changes_suggested'];
  recipe?: ChatMessage['recipe']; // Add support for recipe in optimistic messages
}

export type ChatHistoryItem = ChatMessage | OptimisticMessage;
