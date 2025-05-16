
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';

/**
 * Custom hook for handling chat message mutations
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
      sourceType, 
      sourceUrl, 
      sourceImage,
      messageId,
      meta = {},
      isRetry = false
    }: {
      message: string;
      sourceType?: 'manual' | 'image' | 'url';
      sourceUrl?: string;
      sourceImage?: string;
      messageId?: string;
      meta?: Record<string, any>;
      isRetry?: boolean;
    }) => {
      console.log("[ChatMutation] Starting mutation:", { 
        message: message.substring(0, 15) + '...', 
        sourceType,
        messageId: messageId || 'not-provided',
        isRetry: !!isRetry,
        recipeId: recipe.id,
        meta: meta
      });
      
      // Validate recipe ID to prevent errors
      if (!recipe || !recipe.id) {
        throw new Error("Invalid recipe data: missing recipe ID");
      }
      
      // Show toast notification for request processing
      const toastId = toast({
        title: "Processing your request",
        description: sourceType === 'manual' 
          ? "Our culinary scientist is analyzing your request..."
          : "Extracting recipe information...",
        duration: 5000, // Shorter duration for better UX
      });
      
      try {
        // Implement enhanced request timeout handling with retry logic
        const makeRequest = async (retryCount = 0): Promise<any> => {
          try {
            // Set progressively longer timeouts for retries
            const timeout = 60000 + (retryCount * 15000); // 60s, 75s, 90s, 105s
            
            console.log("[ChatMutation] Making request:", {
              retryCount,
              timestamp: new Date().toISOString()
            });
            
            console.log("[ChatMutation] Sending payload to edge function:", {
              recipeId: recipe.id,
              userMessageLength: message.length,
              sourceType,
              hasSourceUrl: !!sourceUrl,
              hasSourceImage: !!sourceImage,
              messageId: messageId || null,
              retryAttempt: retryCount,
              timeout,
              timestamp: new Date().toISOString(),
              meta
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
                  retryAttempt: retryCount,
                  meta
                }
              }),
              new Promise((_, reject) => 
                setTimeout(() => {
                  console.log("[ChatMutation] Request timeout:", {
                    timeout,
                    retryCount,
                    messageId
                  });
                  reject(new Error("Request timed out after " + timeout + "ms"));
                }, timeout)
              )
            ]) as { data?: any, error?: any };
            
            if (response.error) {
              throw response.error;
            }
            
            console.log("[ChatMutation] Edge function response received:", {
              durationMs: Date.now() - (meta.timestamp || Date.now()),
              hasData: !!response.data,
              hasError: !!response.error,
              retryCount,
              timestamp: new Date().toISOString()
            });
            
            return response;
          } catch (error: any) {
            // Implement retry for certain errors with exponential backoff
            const isRetriableError = 
              error.message?.includes("timeout") || 
              error.message?.includes("network") || 
              error.status === 503 || 
              error.status === 504;
              
            if (retryCount < 3 && isRetriableError) {
              console.log(`[ChatMutation] Retrying request (attempt ${retryCount + 1})...`);
              // Update toast to show retry attempt
              toast.dismiss(toastId);
              toast({
                title: "Still processing",
                description: `Retry attempt ${retryCount + 1}...`,
                duration: 3000,
              });
              // Add exponential backoff
              await new Promise(resolve => 
                setTimeout(resolve, 1000 * Math.pow(2, retryCount))
              );
              return makeRequest(retryCount + 1);
            }
            throw error;
          }
        };

        // Make the request with retry capability
        const response = await makeRequest();
        
        console.log("[ChatMutation] Edge function request:", performance.now(), "ms");

        if (!response.data) {
          console.error("Edge function returned no data");
          throw new Error("No data returned from edge function");
        }
        
        if (response.data.error) {
          console.error("Edge function response contains error:", response.data.error);
          throw new Error(response.data.error);
        }

        // Extract and validate the AI response content
        const aiResponse = response.data.textResponse || 
                          response.data.text || 
                          JSON.stringify({
                            textResponse: "I couldn't generate a proper analysis for this recipe. Please try again."
                          });
        
        if (!aiResponse) {
          console.error("No valid response content found in:", response.data);
          throw new Error("Invalid AI response format");
        }

        // Log the exact content we're saving to help with debugging
        console.log("[ChatMutation] Processing AI response:", {
          responseLength: aiResponse.length,
          hasChanges: !!response.data.changes || !!response.data.recipe,
          changesCount: 
            (response.data.changes ? Object.keys(response.data.changes).length : 0) + 
            (response.data.recipe ? 1 : 0),
          timestamp: new Date().toISOString()
        });
        
        console.log("[ChatMutation] Saving to database:", {
          recipeId: recipe.id,
          messageId: messageId || null,
          sourceType,
          timestamp: new Date().toISOString()
        });
        
        try {
          // Create meta object for optimistic updates tracking
          const metaData = messageId ? { 
            ...meta,
            optimistic_id: messageId,
            is_retry: !!isRetry
          } : meta;
          
          // Ensure we're using a valid source type
          const validSourceType = sourceType && ['manual', 'image', 'url'].includes(sourceType) 
            ? sourceType 
            : 'manual';
          
          const startTime = performance.now();
          
          // Insert the chat message into the database
          const { data: chatData, error: chatError } = await supabase
            .from('recipe_chats')
            .insert({
              recipe_id: recipe.id,
              user_message: message,
              ai_response: aiResponse,
              changes_suggested: response.data.changes || null,
              recipe: response.data.recipe || null,
              source_type: validSourceType,
              source_url: sourceUrl,
              source_image: sourceImage,
              meta: metaData
            })
            .select()
            .single();

          console.log("[ChatMutation] Database save:", performance.now() - startTime, "ms");
          
          if (chatError) {
            console.log("[ChatMutation] Database error:", {
              error: chatError,
              timestamp: new Date().toISOString()
            });
            throw chatError;
          }
          
          console.log("[ChatMutation] Chat successfully saved to database with ID:", chatData?.id);
          // Dismiss the processing toast
          toast.dismiss(toastId);
          return { data: chatData, messageId };
        } catch (dbError: any) {
          console.log("[ChatMutation] Database save error:", {
            code: dbError.code,
            message: dbError.message,
            details: dbError.details,
            hint: dbError.hint
          });
          
          console.error("[ChatMutation] Error in mutation function:", dbError);
          
          // Enhanced database error handling
          if (dbError.message?.includes("violates not-null constraint")) {
            throw new Error("Failed to save chat response: Required field is missing");
          }
          throw dbError;
        } finally {
          console.log("[ChatMutation] Request process completed");
        }
      } catch (err: any) {
        console.error("[ChatMutation] Error:", err);
        // Make sure to dismiss the toast even on error
        toast.dismiss(toastId);
        throw err;
      }
    },
    onSuccess: (result) => {
      console.log("[ChatMutation] onSuccess callback:", {
        messageId: result?.messageId || 'not-provided',
        timestamp: new Date().toISOString()
      });
      
      queryClient.invalidateQueries({ queryKey: ['recipe-chats', recipe.id] });
      // Fix: Use the correct toast format with a string title or proper object format
      toast({
        title: "Response received",
        description: "Culinary analysis complete",
        duration: 3000,
      });
    },
    onError: (error: any, variables) => {
      console.log("[ChatMutation] onError callback:", {
        error,
        messageId: variables.messageId || 'not-provided',
        timestamp: new Date().toISOString()
      });
      
      // Enhanced error handling with better UX
      let errorMessage = "Failed to get AI response";
      
      // Extract the most meaningful error message
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Display more specific errors for common issues
      if (errorMessage.includes("violates check constraint")) {
        const constraintMatch = errorMessage.match(/violates check constraint "([^"]+)"/);
        if (constraintMatch && constraintMatch[1]) {
          const constraint = constraintMatch[1];
          if (constraint === "valid_source_type") {
            errorMessage = "Invalid source type. Please try again.";
          }
        }
      }
      
      console.log("[ChatMutation] Formatted error:", {
        originalError: error,
        displayMessage: errorMessage,
        timestamp: new Date().toISOString()
      });
      
      // Truncate very long error messages
      const displayMessage = errorMessage.length > 100 
        ? `${errorMessage.substring(0, 100)}...` 
        : errorMessage;
      
      // Fix: Use the correct toast format for error messages
      toast({
        title: "Error",
        description: displayMessage,
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
