
// Chat message types
export interface ChatMeta {
  optimistic_id?: string;
  is_retry?: boolean;
}

export interface OptimisticMessage {
  id: string;
  recipe_id: string;
  user_message: string;
  isOptimistic: true;
  created_at: string;
}

export interface ChangesResponse {
  mode?: 'add' | 'replace' | 'none';
  title?: string;
  tagline?: string;
  description?: string;
  cuisine?: string;
  cooking_tip?: string;
  science_notes?: string[];
  ingredients?: {
    mode: 'add' | 'replace' | 'none';
    items: any[];
  };
  instructions?: string[];
  nutrition?: any;
}

export interface ChatMessage {
  id: string;
  recipe_id: string;
  user_message: string;
  ai_response: string;
  changes_suggested?: ChangesResponse;
  source_type?: string;
  source_url?: string;
  source_image?: string;
  applied: boolean;
  created_at: string;
  meta?: ChatMeta;
  follow_up_questions?: string[];
}
