
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
      console.log("Starting recipe chat mutation:", { 
        message: message.length > 20 ? `${message.substring(0, 20)}...` : message, // Limit logged message length 
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
        const makeRequest = async (retryCount = 0): Promise<EdgeFunctionResponse> => {
          try {
            // Set progressively longer timeouts for retries with exponential backoff
            const baseTimeout = 60000; // 60s base timeout
            const timeout = baseTimeout * Math.pow(1.5, retryCount); // Exponential increase
            
            // Log the request attempt with limited payload info
            console.log("Sending payload to recipe-chat edge function:", {
              recipeId: recipe.id,
              userMessage: message.length > 20 ? `${message.substring(0, 20)}...` : message,
              sourceType,
              hasSourceUrl: !!sourceUrl,
              hasSourceImage: !!sourceImage,
              messageId,
              retryAttempt: retryCount
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
                setTimeout(() => reject(new Error("Request timed out after " + timeout + "ms")), timeout)
              )
            ]) as EdgeFunctionResponse;
            
            if (response.error) {
              throw response.error;
            }
            
            return response;
          } catch (error) {
            // Type guard to work with the error properties
            const chatError = error as ChatError;
            
            // Implement adaptive retry logic based on error type
            const isRetriableError = 
              chatError.message?.includes("timeout") || 
              chatError.message?.includes("network") || 
              chatError.status === 503 || 
              chatError.status === 504;
              
            // Use dynamic retry count based on error type
            const maxRetries = chatError.message?.includes("timeout") ? 4 : 3;
            
            if (retryCount < maxRetries && isRetriableError) {
              console.log(`Retrying request (attempt ${retryCount + 1} of ${maxRetries})...`);
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
                          JSON.stringify({
                            textResponse: "I couldn't generate a proper analysis for this recipe. Please try again."
                          });
        
        if (!aiResponse) {
          console.error("No valid response content found in:", response.data);
          throw new Error("Invalid AI response format");
        }

        // Log limited response content to avoid exposing sensitive data
        const responseSummary = aiResponse.length > 100 ? 
          `${aiResponse.substring(0, 100)}...` : aiResponse;
        console.log("Saving chat message to database with response:", responseSummary);
        
        try {
          // Create meta object for optimistic updates tracking
          const meta = messageId ? { 
            optimistic_id: messageId,
            is_retry: !!isRetry
          } : {};
          
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

          if (error) {
            console.error("Error saving chat to database:", error);
            throw error;
          }
          
          console.log("Chat successfully saved to database with ID:", data.id);
          return { data, messageId };
        } catch (dbError) {
          console.error("Database error when saving chat:", dbError);
          
          // Enhanced database error handling
          const typedDbError = dbError as { message?: string };
          
          if (typedDbError.message?.includes("violates not-null constraint")) {
            throw new Error("Failed to save chat response: Required field is missing");
          }
          throw dbError;
        }
      } catch (err) {
        console.error("Recipe chat error:", err);
        throw err;
      } finally {
        // Fix: Properly clean up the toast notification
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
    onError: (error, variables) => {
      console.error("Recipe chat mutation error:", error, "for message ID:", variables.messageId || 'not-provided');
      
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
