
// Define the structure for chat message changes
export interface InstructionChange {
  action: string;
  index?: number;
  text?: string;
}

export interface IngredientChanges {
  mode: 'add' | 'replace' | 'none';
  items: any[];
}

export interface SuggestedChanges {
  title?: string;
  ingredients?: IngredientChanges;
  instructions?: InstructionChange[] | string[];
  nutrition?: any;
  science_notes?: string[];
}

// Define metadata for chat messages
export interface ChatMeta {
  optimistic_id?: string;
  error?: boolean;
  error_details?: string;
  [key: string]: any;
}

// Response from changes application
export interface ChangesResponse {
  success: boolean;
  recipe?: any;
  error?: string;
  message?: string;
}

// Define the chat message type
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  status?: 'pending' | 'complete' | 'error';
  timestamp?: number;
  error?: string;
  changes_suggested?: SuggestedChanges;
  recipe?: any; // For complete recipe updates
  
  // UI display properties
  displayText?: string;
  showWarning?: boolean;
  changesPreview?: boolean;
  isMethodology?: boolean;
  
  // Response properties
  response?: any;
  
  // New fields that appear in existing code
  user_message?: string;
  ai_response?: string;
  follow_up_questions?: string[];
  applied?: boolean;
  meta?: ChatMeta;
}

// Optimistic message for UI rendering during API calls
export interface OptimisticMessage {
  id: string;
  user_message: string;
  ai_response?: string;
  status: 'pending' | 'complete' | 'error';
  timestamp: number;
  meta?: ChatMeta;
  applied?: boolean;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  recipeId?: string;
  createdAt: number;
  title?: string;
}
