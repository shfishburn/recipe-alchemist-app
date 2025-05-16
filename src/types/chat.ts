
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

export interface InstructionChange {
  action?: string;
  [key: string]: any;
}

export interface ChatMessage {
  id: string;
  recipe_id?: string;
  user_message?: string;
  ai_response?: string;
  changes_suggested?: {
    title?: string;
    ingredients?: {
      mode: 'add' | 'replace' | 'none';
      items: any[];
    };
    instructions?: string[] | InstructionChange[];
    science_notes?: string[];
    nutrition?: any;
    [key: string]: any;
  };
  source_type?: string;
  source_url?: string;
  source_image?: string;
  meta?: ChatMeta;
  timestamp?: number;
  created_at?: string;
  
  // New fields to fix build errors
  applied?: boolean;
  follow_up_questions?: string[];
  
  // New field to support the complete recipe object
  recipe?: Recipe | QuickRecipe;
}

export interface OptimisticMessage extends Partial<ChatMessage> {
  id: string;
  recipe_id?: string;
  pending: boolean;
  content?: string;
  meta?: ChatMeta;
  timestamp: number;
}

// Alias for backward compatibility
export type ChangesResponse = ChatMessage['changes_suggested'];
