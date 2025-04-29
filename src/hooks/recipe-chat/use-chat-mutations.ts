
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';

export const useChatMutations = (recipe: Recipe) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ 
      message, 
      sourceType, 
      sourceUrl, 
      sourceImage,
      messageId // Add support for tracking message ID
    }: {
      message: string;
      sourceType?: 'manual' | 'image' | 'url';
      sourceUrl?: string;
      sourceImage?: string;
      messageId?: string; // Optional message ID for tracking
    }) => {
      console.log("Starting recipe chat mutation:", { 
        message, 
        sourceType,
        messageId: messageId || 'not-provided'
      });
      
      toast({
        title: "Processing your request",
        description: sourceType === 'manual' 
          ? "Our culinary scientist is analyzing your request..."
          : "Extracting recipe information...",
      });
      
      console.log("Invoking recipe-chat edge function");
      
      try {
        const response = await supabase.functions.invoke('recipe-chat', {
          body: { 
            recipe, 
            userMessage: message,
            sourceType,
            sourceUrl,
            sourceImage,
            messageId // Pass message ID to edge function if provided
          }
        });

        if (response.error) {
          console.error("Edge function returned an error:", response.error);
          throw response.error;
        }
        
        console.log("Edge function response:", response.data);
        
        if (!response.data) {
          console.error("Edge function returned no data");
          throw new Error("No data returned from edge function");
        }
        
        if (response.data.error) {
          console.error("Edge function response contains error:", response.data.error);
          throw new Error(response.data.error);
        }

        // Extract and validate the AI response content
        const aiResponse = response.data.textResponse || JSON.stringify({
          textResponse: "I couldn't generate a proper analysis for this recipe. Please try again."
        });
        
        if (!aiResponse) {
          console.error("No valid response content found in:", response.data);
          throw new Error("Invalid AI response format");
        }

        // Log the exact content we're saving to help with debugging
        console.log("Saving chat message to database with response:", aiResponse.substring(0, 100) + "...");
        console.log("Original message ID for tracking:", messageId || 'not-provided');
        
        try {
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
              // Store the message ID if provided to help with optimistic updates
              meta: messageId ? { optimistic_id: messageId } : null
            })
            .select()
            .single();

          if (error) {
            console.error("Error saving chat to database:", error);
            throw error;
          }
          
          console.log("Chat successfully saved to database with ID:", data.id);
          // Return the data along with the original message ID for tracking
          return { data, messageId };
        } catch (dbError: any) {
          console.error("Database error when saving chat:", dbError);
          // If we hit a database constraint error, let's provide more specific feedback
          if (dbError.message?.includes("violates not-null constraint") && 
              dbError.message?.includes("ai_response")) {
            throw new Error("Failed to save chat response: AI response cannot be empty");
          }
          throw dbError;
        }
      } catch (err: any) {
        console.error("Recipe chat error:", err);
        throw err;
      }
    },
    onSuccess: (result) => {
      console.log("Recipe chat mutation completed successfully with messageId:", result?.messageId || 'not-provided');
      queryClient.invalidateQueries({ queryKey: ['recipe-chats', recipe.id] });
      toast({
        title: "Response received",
        description: "Culinary analysis complete",
      });
    },
    onError: (error: any, variables) => {
      console.error("Recipe chat mutation error:", error, "for message ID:", variables.messageId || 'not-provided');
      toast({
        title: "Error",
        description: error.message || "Failed to get AI response",
        variant: "destructive",
      });
      // Even though there was an error, we should invalidate the query to refresh the chat history
      // This helps clear any optimistic messages
      queryClient.invalidateQueries({ queryKey: ['recipe-chats', recipe.id] });
    },
  });

  return mutation;
};
