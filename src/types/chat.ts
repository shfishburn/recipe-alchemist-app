
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

export interface ChatMessage {
  id?: string;
  user_message: string;
  ai_response?: string;
  recipe_id?: string;
  created_at?: string;
  changes_suggested?: ChangesResponse;
  applied?: boolean;
  follow_up_questions?: string[];
}

export interface AIResponse {
  textResponse: string;
  changes: ChangesResponse;
  followUpQuestions: string[];
}
