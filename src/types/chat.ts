
export interface ChatMessage {
  id: string;
  recipe_id: string;
  user_message: string;
  ai_response: string;
  changes_suggested?: ChangesResponse | null;
  source_type?: string;
  source_url?: string;
  source_image?: string;
  applied?: boolean;
  created_at?: string;
  meta?: ChatMeta;
  follow_up_questions?: string[];
}

export interface OptimisticMessage extends ChatMessage {
  pending?: boolean;
  recipe_id: string;
  ai_response: string;
  meta: ChatMeta;
}

export interface ChangesResponse {
  mode?: 'add' | 'replace' | 'none';
  title?: string;
  description?: string;
  tagline?: string;
  ingredients?: {
    mode: 'add' | 'replace' | 'none';
    items: any[];
  };
  instructions?: string[];
  science_notes?: string[];
  nutrition?: Record<string, any>;
}

export interface ChatMeta {
  optimistic_id?: string;
  tracking_id?: string;
  processing_stage?: string;
  error?: boolean;
  is_retry?: boolean;
  source_info?: {
    type: 'manual' | 'image' | 'url';
    url?: string;
  };
}
