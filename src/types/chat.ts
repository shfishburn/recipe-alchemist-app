
import type { Json } from '@/integrations/supabase/types';

export interface ChatMessage {
  id: string;
  user_message: string;
  ai_response: string;
  follow_up_questions?: string[];
  changes_suggested: {
    title?: string;
    ingredients?: {
      mode: 'add' | 'replace' | 'none';
      items: Array<{
        qty: number;
        unit: string;
        item: string;
        notes?: string;
      }>;
    };
    instructions?: Array<{
      stepNumber?: number;
      action: string;
      explanation?: string;
      whyItWorks?: string;
      troubleshooting?: string;
      indicator?: string;
    }> | string[];
    nutrition?: {
      kcal?: number;
      protein_g?: number;
      carbs_g?: number;
      fat_g?: number;
      fiber_g?: number;
      sugar_g?: number;
      sodium_mg?: number;
    };
    health_insights?: string[];
    equipmentNeeded?: string[];
    scientific_principles?: string[];
  } | null;
  applied: boolean;
  created_at: string;
}
