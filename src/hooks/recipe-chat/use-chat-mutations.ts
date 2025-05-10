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
      isRetry = false
    }: {
      message: string;
      sourceType?: 'manual' | 'image' | 'url' | 'analysis';
      sourceUrl?: string;
      sourceImage?: string;
      messageId?: string;
      isRetry?: boolean;
    }) => {
      console.log("Starting recipe chat mutation:", { 
        message, 
        sourceType,
        messageId: messageId || 'not-provided',
        isRetry: !!isRetry,
        recipeId: recipe.id
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
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Request timed out after " + timeout + "ms")), timeout)
              )
            ]) as { data?: any, error?: any };
            
            if (response.error) {
              throw response.error;
            }
            
            return response;
          } catch (error: any) {
            // Implement retry for certain errors with exponential backoff
            const isRetriableError = 
              error.message?.includes("timeout") || 
              error.message?.includes("network") || 
              error.status === 503 || 
              error.status === 504;
              
            if (retryCount < 3 && isRetriableError) {
              console.log(`Retrying request (attempt ${retryCount + 1})...`);
              // Update toast to show retry attempt
              toast({
                id: toastId,
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
        console.log("Saving chat message to database with response:", aiResponse.substring(0, 100) + "...");
        
        try {
          // Create meta object for optimistic updates tracking
          const meta = messageId ? { 
            optimistic_id: messageId,
            is_retry: !!isRetry
          } : {};
          
          // Insert the chat message into the database
          const { data, error } = await supabase
            .from('recipe_chats')
            .insert({
              recipe_id: recipe.id,
              user_message: message,
              ai_response: aiResponse,
              changes_suggested: response.data.changes || null,
              source_type: sourceType || 'manual',
              source_url: sourceUrl,
              source_image: sourceImage,
              meta: meta
            })
            .select()
            .single();

          if (error) {
            console.error("Error saving chat to database:", error);
            throw error;
          }
          
          console.log("Chat successfully saved to database with ID:", data.id);
          return { data, messageId };
        } catch (dbError: any) {
          console.error("Database error when saving chat:", dbError);
          
          // Enhanced database error handling
          if (dbError.message?.includes("violates not-null constraint")) {
            throw new Error("Failed to save chat response: Required field is missing");
          }
          throw dbError;
        }
      } catch (err: any) {
        console.error("Recipe chat error:", err);
        throw err;
      } finally {
        // Clear the processing toast regardless of outcome
        toast({
          id: toastId,
          duration: 0, // Immediately remove the processing toast
        });
      }
    },
    onSuccess: (result) => {
      console.log("Recipe chat mutation completed successfully with messageId:", result?.messageId || 'not-provided');
      queryClient.invalidateQueries({ queryKey: ['recipe-chats', recipe.id] });
      toast({
        title: "Response received",
        description: "Culinary analysis complete",
        duration: 3000,
      });
    },
    onError: (error: any, variables) => {
      console.error("Recipe chat mutation error:", error, "for message ID:", variables.messageId || 'not-provided');
      
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
      
      // Truncate very long error messages
      const displayMessage = errorMessage.length > 100 
        ? `${errorMessage.substring(0, 100)}...` 
        : errorMessage;
      
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
