
import type { ChatMessage, ChangesResponse } from '@/types/chat';
import { PostgrestResponse } from '@supabase/supabase-js';

/**
 * Type definition for Supabase's Json type to help with type safety
 */
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

/**
 * Interface for database chat message structure
 */
export interface DbChatMessage {
  id: string;
  user_message: string;
  ai_response: string;
  recipe_id: string;
  changes_suggested: Json;
  source_type?: string;
  source_url?: string;
  source_image?: string;
  applied: boolean;
  created_at: string;
  deleted_at?: string;
  follow_up_questions?: Json;
  meta?: Json;
}

/**
 * Safely convert Supabase JSON to a specific type
 */
export function safeJsonCast<T>(json: Json | undefined | null, fallback: T): T {
  if (json === undefined || json === null) return fallback;
  
  try {
    if (typeof json === 'object') return json as unknown as T;
    return JSON.parse(json.toString()) as T;
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return fallback;
  }
}

/**
 * Convert database chat message to application chat message
 */
export function dbToChatMessage(dbMessage: DbChatMessage): ChatMessage {
  return {
    id: dbMessage.id,
    user_message: dbMessage.user_message,
    ai_response: dbMessage.ai_response,
    recipe_id: dbMessage.recipe_id,
    changes_suggested: safeJsonCast<ChangesResponse>(dbMessage.changes_suggested, null),
    follow_up_questions: safeJsonCast<string[]>(dbMessage.follow_up_questions, []),
    applied: dbMessage.applied || false,
    created_at: dbMessage.created_at,
    meta: safeJsonCast(dbMessage.meta, {})
  };
}

/**
 * Convert application chat message to database format
 */
export function chatToDbMessage(message: ChatMessage): Partial<DbChatMessage> {
  return {
    id: message.id,
    user_message: message.user_message,
    ai_response: message.ai_response,
    recipe_id: message.recipe_id,
    changes_suggested: message.changes_suggested as unknown as Json,
    applied: message.applied || false,
    follow_up_questions: message.follow_up_questions as unknown as Json,
    meta: message.meta as unknown as Json
  };
}

/**
 * Process a PostgrestResponse to an array of chat messages
 */
export function processDbChatResponse(response: PostgrestResponse<DbChatMessage>): ChatMessage[] {
  if (response.error) {
    console.error("Database query error:", response.error);
    return [];
  }
  
  return (response.data || []).map(dbToChatMessage);
}
