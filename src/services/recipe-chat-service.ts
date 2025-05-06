
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import type { QuickRecipe } from '@/hooks/use-quick-recipe';
import type { ChatMessage, OptimisticMessage, AIResponse } from '@/types/chat';
import { useUnifiedChatStore } from '@/store/unified-chat-store';

/**
 * Service class for recipe chat API interactions
 */
export class RecipeChatService {
  /**
   * Send a message to the recipe chat API
   */
  static async sendMessage(
    recipe: Recipe | QuickRecipe,
    message: string,
    messageId: string
  ): Promise<AIResponse> {
    try {
      console.log("Sending recipe chat message:", { recipe: recipe.title, messageId });
      
      const isQuickRecipe = !('id' in recipe) || typeof recipe.id !== 'string' || recipe.id.startsWith('temp-');
      const sourceType = isQuickRecipe ? 'preview' : 'manual';
      
      // Call the edge function with retry mechanism
      const response = await this.callRecipeChatWithRetry({
        recipe,
        userMessage: message,
        sourceType,
        messageId
      });
      
      if (!response.data) {
        throw new Error('No data returned from recipe chat function');
      }
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      // Extract data from the response
      const { textResponse, changes, followUpQuestions } = response.data;
      
      if (!textResponse) {
        throw new Error('Invalid response format from AI');
      }
      
      return {
        textResponse,
        changes: changes || null,
        followUpQuestions: followUpQuestions || []
      };
    } catch (error: any) {
      console.error('Error sending chat message:', error);
      
      // Enhanced error handling with specific error types
      if (error.message?.includes('timeout')) {
        throw new Error('Request timed out. Please try again with a shorter message.');
      }
      
      throw error;
    }
  }
  
  /**
   * Call the recipe chat edge function with retry mechanism
   */
  private static async callRecipeChatWithRetry(
    params: any, 
    retryCount = 0,
    maxRetries = 2
  ): Promise<any> {
    try {
      return await Promise.race([
        supabase.functions.invoke('recipe-chat', { body: params }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Request timed out")), 60000) // 60 second timeout
        )
      ]);
    } catch (error: any) {
      // Retry for network errors or timeouts
      if (retryCount < maxRetries && 
         (error.message?.includes('timeout') || 
          error.message?.includes('network') ||
          error.status === 503 || 
          error.status === 504)) {
        console.log(`Retrying recipe chat request (${retryCount + 1}/${maxRetries})...`);
        
        // Add exponential backoff
        const backoffMs = Math.min(1000 * Math.pow(2, retryCount), 10000);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
        
        return this.callRecipeChatWithRetry(
          { ...params, retryAttempt: retryCount + 1 },
          retryCount + 1,
          maxRetries
        );
      }
      throw error;
    }
  }
  
  /**
   * Save a chat message to the database
   */
  static async saveChatMessage(
    recipe: Recipe | QuickRecipe,
    message: string,
    aiResponse: AIResponse,
    messageId: string,
    sourceType: 'manual' | 'image' | 'url' | 'preview' = 'manual'
  ): Promise<ChatMessage> {
    // For quick recipes, we don't save to database
    if (!('id' in recipe) || typeof recipe.id !== 'string' || recipe.id.startsWith('temp-')) {
      return {
        id: messageId,
        user_message: message,
        ai_response: aiResponse.textResponse,
        changes_suggested: aiResponse.changes,
        follow_up_questions: aiResponse.followUpQuestions,
        meta: { 
          optimistic_id: messageId,
          created_at: Date.now()
        }
      };
    }
    
    try {
      // Create meta object for optimistic updates tracking
      const meta = { optimistic_id: messageId };
      
      // Insert the chat message into the database
      const { data, error } = await supabase
        .from('recipe_chats')
        .insert({
          recipe_id: recipe.id,
          user_message: message,
          ai_response: aiResponse.textResponse,
          changes_suggested: aiResponse.changes || null,
          source_type: sourceType,
          follow_up_questions: aiResponse.followUpQuestions || [],
          meta
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving chat to database:", error);
        throw error;
      }
      
      console.log("Chat successfully saved to database with ID:", data.id);
      
      return {
        id: data.id,
        user_message: data.user_message,
        ai_response: data.ai_response,
        changes_suggested: data.changes_suggested,
        follow_up_questions: data.follow_up_questions || [],
        recipe_id: data.recipe_id,
        created_at: data.created_at,
        meta: data.meta
      };
    } catch (error) {
      console.error("Failed to save chat message:", error);
      throw error;
    }
  }
  
  /**
   * Mark a chat message as applied
   */
  static async markMessageAsApplied(messageId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('recipe_chats')
        .update({ applied: true })
        .eq('id', messageId);
        
      if (error) {
        console.error("Error marking message as applied:", error);
        throw error;
      }
      
      useUnifiedChatStore.getState().markMessageAsApplied(messageId);
    } catch (error) {
      console.error("Failed to mark message as applied:", error);
      throw error;
    }
  }
  
  /**
   * Process an image and send it for recipe analysis
   */
  static async processImageForRecipe(
    recipe: Recipe | QuickRecipe,
    file: File,
    messageId: string
  ): Promise<AIResponse> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const base64Image = e.target?.result as string;
          
          const isQuickRecipe = !('id' in recipe) || typeof recipe.id !== 'string' || recipe.id.startsWith('temp-');
          const sourceType = isQuickRecipe ? 'preview' : 'image';
          
          const response = await this.callRecipeChatWithRetry({
            recipe, 
            userMessage: "Please analyze this recipe image",
            sourceType,
            sourceImage: base64Image,
            messageId
          });
          
          if (!response.data) {
            throw new Error('No data returned from recipe chat function');
          }
          
          if (response.data.error) {
            throw new Error(response.data.error);
          }
          
          // Extract data from the response
          const { textResponse, changes, followUpQuestions } = response.data;
          
          if (!textResponse) {
            throw new Error('Invalid response format from AI');
          }
          
          resolve({
            textResponse,
            changes: changes || null,
            followUpQuestions: followUpQuestions || []
          });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Failed to read image file"));
      };
      
      reader.readAsDataURL(file);
    });
  }
  
  /**
   * Process a URL for recipe analysis
   */
  static async processUrlForRecipe(
    recipe: Recipe | QuickRecipe,
    url: string,
    messageId: string
  ): Promise<AIResponse> {
    try {
      const isQuickRecipe = !('id' in recipe) || typeof recipe.id !== 'string' || recipe.id.startsWith('temp-');
      const sourceType = isQuickRecipe ? 'preview' : 'url';
      
      const response = await this.callRecipeChatWithRetry({
        recipe, 
        userMessage: "Please analyze this recipe URL",
        sourceType,
        sourceUrl: url,
        messageId
      });
      
      if (!response.data) {
        throw new Error('No data returned from recipe chat function');
      }
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      // Extract data from the response
      const { textResponse, changes, followUpQuestions } = response.data;
      
      if (!textResponse) {
        throw new Error('Invalid response format from AI');
      }
      
      return {
        textResponse,
        changes: changes || null,
        followUpQuestions: followUpQuestions || []
      };
    } catch (error) {
      console.error("Failed to process URL:", error);
      throw error;
    }
  }
}
