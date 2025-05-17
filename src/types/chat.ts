
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
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  recipeId?: string;
  createdAt: number;
  title?: string;
}
