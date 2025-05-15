
import { Ingredient, Recipe } from './recipe';

// Define the status for a chat message
export type ChatMessageStatus = 'pending' | 'complete' | 'failed';

// Define the source of a chat message
export type ChatMessageSource = 'manual' | 'analysis' | 'modification' | 'url' | 'image';

// Define the shape of a chat message's changes
export interface ChangesResponse {
  mode?: 'replace' | 'add' | 'none';
  title?: string;
  description?: string; // Added description field
  ingredients?: {
    mode: 'replace' | 'add' | 'none';
    items: Ingredient[];
  };
  instructions?: string[];
  science_notes?: string[];
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    [key: string]: any;
  };
}

// Define metadata type for chat messages
export interface ChatMeta {
  optimistic_id?: string;
  tracking_id?: string;
  processing_stage?: string;
  is_retry?: boolean;
  error?: boolean;
  timestamp?: number;
  source_info?: {
    type?: string;
    url?: string;
  };
  [key: string]: any;
}

// Define the shape of a chat message
export interface ChatMessage {
  id: string;
  recipe_id: string;
  user_message: string;
  ai_response: string;
  changes_suggested?: ChangesResponse;
  created_at?: string;
  updated_at?: string;
  source_type?: ChatMessageSource;
  source_url?: string;
  source_image?: string;
  status?: ChatMessageStatus;
  applied?: boolean;
  optimistic?: boolean;
  meta?: ChatMeta;
  follow_up_questions?: string[]; // Added follow_up_questions
}

// Define the type for optimistic messages
export interface OptimisticMessage extends ChatMessage {
  pending: boolean;
  timestamp?: number;
}

export interface RecipeChatSettings {
  temperature?: number;
  model?: string;
  systemPrompt?: string;
}

export type ChatSettings = RecipeChatSettings;

export interface ChatHistoryResponse {
  data: ChatMessage[];
  error: any;
}
