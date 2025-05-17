import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { getCorsHeadersWithOrigin } from "../_shared/cors.ts";
import { storeRecipeVersion, getLatestVersionNumber } from "../_shared/recipe-versions.ts";
import { validateRecipeIntegrity } from "./validation.ts";
import { buildUnifiedRecipePrompt } from "../_shared/recipe-prompts.ts";

// Define circuit breaker to prevent cascading failures
class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime: number | null = null;
  private isOpen = false;

  constructor(
    private maxFailures = 5,
    private resetTimeout = 30000 // 30 seconds
  ) {}

  async execute(fn) {
    if (this.isOpen) {
      if (Date.now() - (this.lastFailureTime || 0) > this.resetTimeout) {
        this.reset();
      } else {
        throw new Error("Circuit is open, request rejected");
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.maxFailures) {
      this.isOpen = true;
    }
  }

  private reset() {
    this.failureCount = 0;
    this.isOpen = false;
    this.lastFailureTime = null;
  }
}

/**
 * Helper function to extract science notes from text when structured notes are missing
 * Analyzes paragraphs and sentences for scientific content based on food science keywords
 * @param text The text to extract science notes from
 * @returns Array of extracted science notes, limited to 5 items maximum
 */
function extractScienceNotesFromText(text: string): string[] {
  const scienceKeywords = ['chemistry', 'maillard', 'protein', 'reaction', 'temperature', 'starch'];
  const paragraphs = text.split(/\n\n+/);
  const scienceNotes: string[] = [];
  
  // Look for paragraphs containing science keywords
  paragraphs.forEach(paragraph => {
    const lowerParagraph = paragraph.toLowerCase();
    
    for (const keyword of scienceKeywords) {
      if (lowerParagraph.includes(keyword) && paragraph.length > 30) {
        // Clean up the paragraph
        const cleaned = paragraph
          .replace(/^#+\s+/, '') // Remove markdown headers
          .replace(/^\d+\.\s+/, '') // Remove numbered list markers
          .replace(/^\*\s+/, '') // Remove bullet points
          .trim();
        
        if (cleaned.length > 0) {
          scienceNotes.push(cleaned);
          break; // Break after finding first keyword match in paragraph
        }
      }
    }
  });
  
  // If we still don't have any science notes, look for sentences
  if (scienceNotes.length === 0) {
    const sentences = text.split(/[.!?]+\s+/);
    
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      for (const keyword of scienceKeywords) {
        if (lowerSentence.includes(keyword) && sentence.length > 20) {
          scienceNotes.push(sentence.trim());
          break;
        }
      }
      
      // Limit to 3 extracted notes
      if (scienceNotes.length >= 3) break;
    }
  }
  
  return scienceNotes.slice(0, 5); // Return at most 5 notes
}

// Chatbot system prompt for standard (non-unified) response format
const chatSystemPrompt = `You are a culinary scientist specializing in food chemistry and cooking techniques. Always respond in JSON format. When suggesting changes to recipes:

1. Always format responses as JSON with changes
2. For cooking instructions:
   - Include specific temperatures (F° and C°)
   - Specify cooking durations
   - Add equipment setup details
   - Include doneness indicators
   - Add resting times when needed
3. Format ingredients with exact measurements and shopability:
   - US-imperial first, metric in ( )
   - Each item gets a typical US grocery package size
   - Include \`shop_size_qty\` and \`shop_size_unit\`
4. Validate all titles are descriptive and clear
5. Follow López-Alt tone and style:
   - Active voice, clear instructions
   - Concrete sensory cues
   - Ingredient tags: wrap each referenced ingredient in \`**double-asterisks**\`
   - No vague language

Example format:
{
  "textResponse": "Detailed explanation of changes...",
  "changes": {
    "title": "string",
    "ingredients": {
      "mode": "add" | "replace" | "none",
      "items": [{
        "qty_imperial": number,
        "unit_imperial": string,
        "qty_metric": number,
        "unit_metric": string,
        "shop_size_qty": number,
        "shop_size_unit": string,
        "item": string,
        "notes": string
      }]
    },
    "instructions": ["Array of steps"],
    "cookingDetails": {
      "temperature": {
        "fahrenheit": number,
        "celsius": number
      },
      "duration": {
        "prep": number,
        "cook": number,
        "rest": number
      }
    }
  },
  "followUpQuestions": ["Array of suggested follow-up questions"]
}`;

serve(async (req) => {
  // Handle CORS preflight requests with dynamic origin support for credentials
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: getCorsHeadersWithOrigin(req)
    });
  }

  // Prepare consistent headers with content type for all responses
  const headers = {
    ...getCorsHeadersWithOrigin(req),
    'Content-Type': 'application/json'
  };

  try {
    const requestData = await req.json();
    const { recipe, userMessage, sourceType, sourceUrl, sourceImage, messageId, meta } = requestData;
    
    // Validate required parameters
    if (!recipe || !recipe.id) {
      console.error("Missing recipe data in request");
      throw new Error("Recipe data is required");
    }
    
    if (!userMessage) {
      console.error("Missing user message in request");
      throw new Error("User message is required");
    }
    
    console.log(`Processing recipe chat request for recipe ${recipe.id} with message: ${userMessage.substring(0, 50)}...`);
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Get latest version number for this recipe
    const latestVersionNumber = await getLatestVersionNumber(recipe.id);
    const newVersionNumber = latestVersionNumber + 1;

    try {
      // Always use the unified approach for better consistency
      const systemPromptContent = buildUnifiedRecipePrompt(recipe, userMessage, newVersionNumber);
      
      console.log(`Using unified recipe prompt approach`);
      
      const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: systemPromptContent
            },
            {
              role: 'user',
              content: userMessage,
            },
          ],
          temperature: 0.7,
          response_format: { type: "json_object" }, // Enforce JSON output format
          max_tokens: 3500, // Increased for more comprehensive responses
        }),
      }).then((res) => res.json());
      
      if (!aiResponse.choices || !aiResponse.choices[0] || !aiResponse.choices[0].message) {
        console.error("Invalid AI response structure:", aiResponse);
        throw new Error("Failed to get a valid response from OpenAI");
      }
      
      const rawResponse = aiResponse.choices[0].message.content;
      console.log("Raw AI response:", rawResponse.substring(0, 200) + "...");
      console.log("Validating response length:", rawResponse.length);

      // Parse the response
      let processedResponse;
      try {
        processedResponse = JSON.parse(rawResponse);
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        throw new Error("Failed to parse AI response as valid JSON");
      }
      
      // Extract data from response
      const textResponse = processedResponse.textResponse || "No response text provided";
      const completeRecipe = processedResponse.recipe;
      const changes = processedResponse.changes || null;
      const followUpQuestions = processedResponse.followUpQuestions || [];
      
      // Check if the response contains a complete recipe (modification) or just text (question answer)
      let versionData = null;
      if (completeRecipe) {
        // Important: Make sure we have a complete recipe with all required fields preserved
        // Clone the original recipe first to ensure we have all fields
        const fullRecipe = {
          ...recipe,
          ...completeRecipe,
          id: recipe.id, // Always preserve original ID
          // Ensure we keep all standard fields with fallbacks to original values
          title: completeRecipe.title || recipe.title,
          ingredients: completeRecipe.ingredients || recipe.ingredients,
          instructions: completeRecipe.instructions || recipe.instructions,
          servings: completeRecipe.servings || recipe.servings,
          description: completeRecipe.description || recipe.description,
          cuisine: completeRecipe.cuisine || recipe.cuisine,
          cuisine_category: completeRecipe.cuisine_category || recipe.cuisine_category,
          prep_time_min: completeRecipe.prep_time_min || recipe.prep_time_min,
          cook_time_min: completeRecipe.cook_time_min || recipe.cook_time_min,
          science_notes: completeRecipe.science_notes || recipe.science_notes || [],
          nutrition: completeRecipe.nutrition || recipe.nutrition
        };
        
        // Verify recipe integrity before saving
        try {
          validateRecipeIntegrity(fullRecipe);
        } catch (validationError) {
          console.error("Recipe validation failed:", validationError);
          throw new Error(`Recipe validation failed: ${validationError.message}`);
        }
        
        // Store the updated recipe as a new version
        versionData = await storeRecipeVersion({
          recipeId: recipe.id,
          parentVersionId: recipe.version_id || null,
          versionNumber: newVersionNumber,
          userId: null, // No user ID in this context
          modificationRequest: userMessage,
          recipeData: fullRecipe
        });
        
        if (versionData) {
          fullRecipe.version_id = versionData.version_id;
          // Update the complete recipe reference to use this fully populated version
          processedResponse.recipe = fullRecipe;
        }
      }
      
      // Store the chat interaction - strip out recipe to avoid db schema issues
      if (recipe.id) {
        // Create meta object for optimistic updates tracking
        const metaData = {
          ...meta || {},
          optimistic_id: messageId || null
        };
        
        try {
          const { error: chatError } = await supabaseClient
            .from('recipe_chats')
            .insert({
              recipe_id: recipe.id,
              user_message: userMessage,
              ai_response: textResponse,
              changes_suggested: changes, // Store changes not full recipe
              source_type: sourceType || 'manual',
              source_url: sourceUrl,
              source_image: sourceImage,
              version_id: versionData?.version_id, // Link to version if created
              meta: metaData
            });

          if (chatError) {
            console.error("Error storing chat:", chatError);
            throw chatError;
          }
        } catch (dbError) {
          console.error("Database error in recipe-chat function:", dbError);
          // Still return a successful response even if DB insert failed
          // The frontend will handle this via invalidating queries
        }
      }

      return new Response(JSON.stringify(processedResponse), { headers });
      
    } catch (aiError) {
      console.error("Error with OpenAI request:", aiError);
      
      // Add more specific error handling
      let errorMessage = aiError.message || "An unknown error occurred";
      let statusCode = 400;
      
      // Check for specific OpenAI error patterns
      if (errorMessage.includes("messages' must contain the word 'json'")) {
        errorMessage = "Configuration error: JSON format specification missing";
        statusCode = 500; // Server configuration error
      } else if (errorMessage.includes("timeout")) {
        errorMessage = "Request timed out. Please try again.";
        statusCode = 504; // Gateway timeout
      }
      
      throw new Error(`OpenAI request failed: ${errorMessage}`);
    }
  } catch (error) {
    console.error("Error in recipe-chat function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        errorType: error.name,
        timestamp: new Date().toISOString()
      }),
      {
        status: 400,
        headers
      }
    );
  }
});
