
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';
import type { Json } from '@/integrations/supabase/types';

/**
 * Interface for the response from the edge function
 * Contains either data or error information, but not both
 */
interface EdgeFunctionResponse {
  // The data returned by the function, contains recipe modifications and text responses
  data?: {
    textResponse?: string;
    text_response?: string;
    changes?: Record<string, unknown>;
    error?: string;
  };
  // Error information if the request failed
  error?: {
    message: string;
    status?: number;
  };
}

/**
 * Interface for standardizing chat error handling
 * Provides consistent structure for different error sources
 */
interface ChatError {
  // Primary error message
  message?: string;
  // Nested error object from services
  error?: {
    message: string;
  };
  // HTTP status code if available
  status?: number;
}

/**
 * Custom hook for handling chat message mutations
 * Manages sending chat messages to the API and handling the responses
 */
export const useChatMutations = (recipe: Recipe) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  /**
   * Mutation hook for sending chat messages and handling responses
   */
  const mutation = useMutation({
    mutationFn: async ({ 
      message, 
      sourceType = 'manual', // Always provide a default value
      sourceUrl, 
      sourceImage,
      messageId,
      isRetry = false
    }: {
      message: string;
      sourceType?: 'manual' | 'image' | 'url' | 'analysis';
      sourceUrl?: string;
      sourceImage?: string;
      messageId?: string;
      isRetry?: boolean;
    }) => {
      // Enhanced debugging start log
      console.info("[ChatMutation] Starting mutation:", { 
        message: message.length > 20 ? `${message.substring(0, 20)}...` : message,
        sourceType,
        messageId: messageId || 'not-provided',
        isRetry: !!isRetry,
        recipeId: recipe.id,
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now().toString(36)}`
      });
      
      // Validate recipe ID to prevent errors
      if (!recipe || !recipe.id) {
        const error = new Error("Invalid recipe data: missing recipe ID");
        console.error("[ChatMutation] Validation error:", { error });
        throw error;
      }
      
      // Show toast notification for request processing
      const toastId = toast({
        title: "Processing your request",
        description: sourceType === 'manual' 
          ? "Our culinary scientist is analyzing your request..."
          : "Extracting recipe information...",
        duration: 5000,
      });
      
      try {
        // Implement enhanced request timeout handling with retry logic
        const makeRequest = async (retryCount = 0): Promise<EdgeFunctionResponse> => {
          const requestStartTime = Date.now();
          console.log("[ChatMutation] Making request:", {
            retryCount,
            timestamp: new Date().toISOString()
          });
          
          try {
            // Set progressively longer timeouts for retries with exponential backoff
            const baseTimeout = 60000; // 60s base timeout
            const timeout = baseTimeout * Math.pow(1.5, retryCount); // Exponential increase
            
            // Log the request attempt with detailed info
            console.log("[ChatMutation] Sending payload to edge function:", {
              recipeId: recipe.id,
              userMessageLength: message.length,
              sourceType,
              hasSourceUrl: !!sourceUrl,
              hasSourceImage: !!sourceImage,
              messageId,
              retryAttempt: retryCount,
              timeout,
              timestamp: new Date().toISOString()
            });
            
            const response = await Promise.race([
              supabase.functions.invoke('recipe-chat', {
                body: { 
                  recipe, 
                  userMessage: message,
                  sourceType,
                  sourceUrl,
                  sourceImage,
                  messageId,
                  retryAttempt: retryCount
                }
              }),
              new Promise<never>((_, reject) => 
                setTimeout(() => {
                  const timeoutError = new Error("Request timed out after " + timeout + "ms");
                  console.error("[ChatMutation] Request timeout:", {
                    timeout,
                    retryCount,
                    messageId
                  });
                  reject(timeoutError);
                }, timeout)
              )
            ]) as EdgeFunctionResponse;
            
            const requestDuration = Date.now() - requestStartTime;
            console.log("[ChatMutation] Edge function response received:", {
              durationMs: requestDuration,
              hasData: !!response.data,
              hasError: !!response.error,
              retryCount,
              timestamp: new Date().toISOString()
            });
            
            if (response.error) {
              console.error("[ChatMutation] Edge function returned error:", response.error);
              throw response.error;
            }
            
            return response;
          } catch (error) {
            // Type guard to work with the error properties
            const chatError = error as ChatError;
            console.error("[ChatMutation] Request error:", {
              message: chatError.message,
              status: chatError.status,
              retryCount,
              timestamp: new Date().toISOString()
            });
            
            // Implement adaptive retry logic based on error type
            const isRetriableError = 
              chatError.message?.includes("timeout") || 
              chatError.message?.includes("network") || 
              chatError.status === 503 || 
              chatError.status === 504;
              
            // Use dynamic retry count based on error type
            const maxRetries = chatError.message?.includes("timeout") ? 4 : 3;
            
            if (retryCount < maxRetries && isRetriableError) {
              console.log(`[ChatMutation] Retrying request:`, {
                attempt: retryCount + 1,
                maxRetries,
                errorType: chatError.message?.includes("timeout") ? "timeout" : "other",
                timestamp: new Date().toISOString()
              });
              // Update toast to show retry attempt
              toast({
                id: toastId,
                title: "Still processing",
                description: `Retry attempt ${retryCount + 1}...`,
                duration: 3000,
              });
              // Add exponential backoff
              const backoffDelay = 1000 * Math.pow(2, retryCount);
              console.log(`[ChatMutation] Backing off for ${backoffDelay}ms before retry ${retryCount + 1}`);
              await new Promise(resolve => 
                setTimeout(resolve, backoffDelay)
              );
              return makeRequest(retryCount + 1);
            }
            throw error;
          }
        };

        // Make the request with retry capability
        console.time("[ChatMutation] Edge function request");
        const response = await makeRequest();
        console.timeEnd("[ChatMutation] Edge function request");

        if (!response.data) {
          console.error("[ChatMutation] Edge function returned no data");
          throw new Error("No data returned from edge function");
        }
        
        if (response.data.error) {
          console.error("[ChatMutation] Edge function response contains error:", response.data.error);
          throw new Error(response.data.error);
        }

        // Extract and validate the AI response content
        const aiResponse = response.data.textResponse || 
                          JSON.stringify({
                            textResponse: "I couldn't generate a proper analysis for this recipe. Please try again."
                          });
        
        if (!aiResponse) {
          console.error("[ChatMutation] No valid response content found in:", response.data);
          throw new Error("Invalid AI response format");
        }

        // Log response metadata to help with debugging but protect sensitive content
        console.log("[ChatMutation] Processing AI response:", {
          responseLength: aiResponse.length,
          hasChanges: !!response.data.changes,
          changesCount: response.data.changes ? Object.keys(response.data.changes).length : 0,
          timestamp: new Date().toISOString()
        });
        
        try {
          // Create meta object for optimistic updates tracking
          const meta = messageId ? { 
            optimistic_id: messageId,
            is_retry: !!isRetry,
            processed_at: new Date().toISOString()
          } : {
            processed_at: new Date().toISOString()
          };
          
          console.time("[ChatMutation] Database save");
          console.log("[ChatMutation] Saving to database:", {
            recipeId: recipe.id,
            messageId,
            sourceType,
            timestamp: new Date().toISOString()
          });
          
          // Insert the chat message into the database
          // Fix: Convert changes_suggested to JSON type to match expected database type
          const changesValue = response.data.changes || null;
          
          const { data, error } = await supabase
            .from('recipe_chats')
            .insert({
              recipe_id: recipe.id,
              user_message: message,
              ai_response: aiResponse,
              changes_suggested: changesValue as Json,
              source_type: sourceType,
              source_url: sourceUrl,
              source_image: sourceImage,
              meta: meta as Json
            })
            .select()
            .single();

          console.timeEnd("[ChatMutation] Database save");
          
          if (error) {
            console.error("[ChatMutation] Database error:", {
              error,
              timestamp: new Date().toISOString()
            });
            throw error;
          }
          
          console.log("[ChatMutation] Successfully saved chat to database:", {
            chatId: data.id,
            timestamp: new Date().toISOString()
          });
          return { data, messageId };
        } catch (dbError) {
          console.error("[ChatMutation] Database save error:", dbError);
          
          // Enhanced database error handling
          const typedDbError = dbError as { message?: string };
          
          if (typedDbError.message?.includes("violates not-null constraint")) {
            throw new Error("Failed to save chat response: Required field is missing");
          }
          throw dbError;
        }
      } catch (err) {
        console.error("[ChatMutation] Error in mutation function:", err);
        throw err;
      } finally {
        // Fix: Properly clean up the toast notification
        toast({
          id: toastId,
          duration: 0, // Immediately remove the processing toast
        });
        console.log("[ChatMutation] Request process completed");
      }
    },
    onSuccess: (result) => {
      console.log("[ChatMutation] onSuccess callback:", {
        messageId: result?.messageId || 'not-provided',
        timestamp: new Date().toISOString()
      });
      queryClient.invalidateQueries({ queryKey: ['recipe-chats', recipe.id] });
      toast({
        title: "Response received",
        description: "Culinary analysis complete",
        duration: 3000,
      });
    },
    onError: (error, variables) => {
      console.error("[ChatMutation] onError callback:", {
        error,
        messageId: variables.messageId || 'not-provided',
        timestamp: new Date().toISOString()
      });
      
      // Enhanced error handling with better UX
      let errorMessage = "Failed to get AI response";
      
      // Type guard for the error
      const typedError = error as ChatError;
      
      // Extract the most meaningful error message
      if (typedError.message) {
        errorMessage = typedError.message;
      } else if (typedError.error?.message) {
        errorMessage = typedError.error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Log detailed error information
      console.error("[ChatMutation] Formatted error:", {
        originalError: error,
        displayMessage: errorMessage.length > 100 ? 
          `${errorMessage.substring(0, 100)}...` : errorMessage,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Error",
        description: errorMessage.length > 100 ? `${errorMessage.substring(0, 100)}...` : errorMessage,
        variant: "destructive",
        duration: 8000, // Give users more time to read error messages
      });
      
      // Even though there was an error, invalidate the query to refresh the chat history
      // This ensures any partial data is correctly displayed
      queryClient.invalidateQueries({ queryKey: ['recipe-chats', recipe.id] });
    },
  });

  return mutation;
};
