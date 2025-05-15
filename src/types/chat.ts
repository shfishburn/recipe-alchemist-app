
import type { Ingredient, Nutrition } from './recipe';

export interface ChangesResponse {
  title?: string;
  ingredients?: {
    mode: 'add' | 'replace' | 'none';
    items: Ingredient[];
  };
  instructions?: string[] | Array<{
    stepNumber?: number;
    action: string;
    explanation?: string;
    whyItWorks?: string;
    troubleshooting?: string;
    indicator?: string;
  }>;
  nutrition?: Nutrition;
  equipmentNeeded?: string[];
  science_notes?: string[];
  health_insights?: string[];
}

// Enhanced ChatMeta type for better type safety
export interface ChatMeta {
  optimistic_id?: string;
  tracking_id?: string;
  processing_stage?: 'pending' | 'completed' | 'failed';
  source_info?: {
    type?: 'manual' | 'image' | 'url' | 'analysis';
    url?: string;
    imageId?: string;
  };
  [key: string]: any; // Allow for other meta properties while maintaining type safety for known ones
}

export interface ChatMessage {
  id?: string;
  user_message: string;
  ai_response?: string;
  recipe_id?: string;
  created_at?: string;
  changes_suggested?: ChangesResponse;
  applied?: boolean;
  follow_up_questions?: string[];
  meta?: ChatMeta;
}

export interface OptimisticMessage extends ChatMessage {
  pending?: boolean;
  id?: string;
  error?: string | null;
  timestamp?: number;
}

export interface AIResponse {
  textResponse: string;
  changes: ChangesResponse;
  followUpQuestions: string[];
}
