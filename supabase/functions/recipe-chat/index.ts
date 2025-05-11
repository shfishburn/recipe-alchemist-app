import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { getCorsHeadersWithOrigin } from "../_shared/cors.ts";

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

// Function to validate and process the AI response
function validateRecipeChanges(rawResponse) {
  try {
    // Now that we're using response_format: { type: "json_object" },
    // the response should be a JSON object directly
    const jsonResponse = typeof rawResponse === 'string' 
      ? JSON.parse(rawResponse) 
      : rawResponse;
    
    // Safety checks for required fields
    if (!jsonResponse.textResponse && !jsonResponse.text_response) {
      jsonResponse.textResponse = rawResponse;
    }
    
    // Ensure changes object exists with safe defaults
    if (!jsonResponse.changes) {
      jsonResponse.changes = { mode: "none" };
    }
    
    // Ensure ingredients structure is consistent
    if (jsonResponse.changes && jsonResponse.changes.ingredients) {
      if (!Array.isArray(jsonResponse.changes.ingredients.items) || 
          jsonResponse.changes.ingredients.items.length === 0) {
        jsonResponse.changes.ingredients.mode = "none";
        jsonResponse.changes.ingredients.items = [];
      }
    } else if (jsonResponse.changes) {
      // Initialize ingredients with safe defaults if missing
      jsonResponse.changes.ingredients = { mode: "none", items: [] };
    }
    
    // Standardize science_notes format
    if (jsonResponse.science_notes) {
      if (!Array.isArray(jsonResponse.science_notes)) {
        jsonResponse.science_notes = [];
      } else {
        // Filter out any non-string values
        jsonResponse.science_notes = jsonResponse.science_notes
          .filter(note => typeof note === 'string' && note.trim() !== '')
          .map(note => note.trim());
      }
    }
    
    // Ensure follow-up questions is properly initialized
    if (!jsonResponse.followUpQuestions) {
      jsonResponse.followUpQuestions = [];
    }
    
    return jsonResponse;
  } catch (error) {
    console.error("Error validating recipe changes:", error);
    // Fallback to wrapping the raw response as text
    return {
      textResponse: typeof rawResponse === 'string' ? rawResponse : JSON.stringify(rawResponse),
      changes: { mode: "none" },
      followUpQuestions: []
    };
  }
}

// Inline recipe analysis prompt
const recipeAnalysisPrompt = `You are a culinary scientist and expert chef in the López-Alt tradition, analyzing recipes through the lens of food chemistry and precision cooking techniques.

Focus on:
1. COOKING CHEMISTRY:
   - Identify key chemical processes (e.g., Maillard reactions, protein denaturation, emulsification)
   - Explain temperature-dependent reactions and their impact on flavor/texture
   - Note critical control points where chemistry affects outcome
   - Consider various reactions relevant to the specific recipe context

2. TECHNIQUE OPTIMIZATION:
   - Provide appropriate temperature ranges (°F and °C) and approximate timing guidelines
   - Include multiple visual/tactile/aromatic doneness indicators when possible
   - Consider how ingredient preparation affects final results
   - Suggest equipment options and configuration alternatives
   - Balance precision with flexibility based on context

3. INGREDIENT SCIENCE:
   - Functional roles, temp-sensitive items, evidence-based substitutions
   - Recommend evidence-based technique modifications
   - Explain the chemistry behind each suggested change

Return response as JSON with this exact structure:
{
  "textResponse": "Detailed conversational analysis of the recipe chemistry",
  "science_notes": ["Array of scientific explanations"],
  "techniques": ["Array of technique details"],
  "troubleshooting": ["Array of science-based solutions"],
  "changes": {
    "title": "string or null",
    "ingredients": {
      "mode": "add" | "replace" | "none",
      "items": []
    },
    "instructions": []
  },
  "followUpQuestions": ["Array of suggested follow-up questions"] 
}`;

// Inline chat system prompt
const chatSystemPrompt = `You are a culinary scientist specializing in food chemistry and cooking techniques. When suggesting changes to recipes:

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

Example format:
{
  "textResponse": "Detailed explanation of changes...",
  "changes": {
    "title": "string or null",
    "ingredients": {
      "mode": "add" | "replace" | "none",
      "items": [{
        "qty": number,
        "unit": string,
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

// Helper function to extract science notes from text if none were properly structured
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

serve(async (req) => {
  // Handle CORS preflight requests - UPDATED FOR CONSISTENT CREDENTIALS HANDLING
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: getCorsHeadersWithOrigin(req) // Use dynamic origin consistently
    });
  }

  try {
    const requestData = await req.json();
    const { recipe, userMessage, sourceType, sourceUrl, sourceImage, messageId, retryAttempt = 0 } = requestData;
    
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
    console.log(`Retry attempt: ${retryAttempt}`);
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Use the appropriate prompt based on the source type
    const systemPrompt = sourceType === 'analysis' ? recipeAnalysisPrompt : chatSystemPrompt;

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Special safety parameters for analysis mode to prevent data loss
    const analysisInstructions = sourceType === 'analysis' ? `
    IMPORTANT INSTRUCTION FOR ANALYSIS:
    1. Do NOT include instructions or ingredients unless you have improved them significantly.
    2. Never return empty arrays for ingredients or instructions.
    3. If you don't have significant improvements for ingredients, set ingredients.mode to "none".
    4. Always provide at least 3 specific science notes related to the chemistry of the recipe.
    5. Structure your analysis sections clearly with headers (## Chemistry, ## Techniques, ## Troubleshooting).
    ` : '';

    const prompt = `
    Current recipe:
    ${JSON.stringify(recipe)}

    User request:
    ${userMessage}

    ${analysisInstructions}

    Please respond conversationally in plain text. If suggesting changes, include them in a separate JSON structure.
    If relevant, provide cooking advice and tips as a culinary expert would.
    Always include 2-3 follow-up questions at the end that the user might want to ask next.
    `;

    console.log(`Sending request to OpenAI with ${prompt.length} characters`);

    try {
      // Calculate an adaptive timeout based on retry attempt
      const timeout = Math.min(60000 + (retryAttempt * 15000), 120000); // Between 60-120 seconds
      
      const aiResponse = await Promise.race([
        fetch('https://api.openai.com/v1/chat/completions', {
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
                content: systemPrompt + "\nIMPORTANT: Provide responses in a conversational tone. For analysis requests, make sure to include explicit sections for science notes, techniques, and troubleshooting. Always include follow-up questions.",
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }, // Enforce JSON output format
            max_tokens: 3500, // Increased for more comprehensive responses
          }),
        }).then((res) => res.json()),
        new Promise((_, reject) => setTimeout(() => reject(new Error("OpenAI API timeout")), timeout))
      ]);
      
      if (!aiResponse.choices || !aiResponse.choices[0] || !aiResponse.choices[0].message) {
        console.error("Invalid AI response structure:", aiResponse);
        throw new Error("Failed to get a valid response from OpenAI");
      }
      
      const rawResponse = aiResponse.choices[0].message.content;
      console.log("Raw AI response:", rawResponse.substring(0, 200) + "...");

      // Process the response with our validation function
      const processedResponse = validateRecipeChanges(rawResponse);
      
      // Prepare the response data format
      let textResponse = processedResponse.textResponse || processedResponse.text_response || rawResponse;
      let changes = processedResponse.changes || { mode: "none" };
      let scienceNotes = processedResponse.science_notes || [];
      let techniques = processedResponse.techniques || [];
      let troubleshooting = processedResponse.troubleshooting || [];
      let followUpQuestions = processedResponse.followUpQuestions || [];
      
      // Add additional safety checks for analysis mode
      if (sourceType === 'analysis') {
        // Force ingredients mode to "none" if no items or empty array
        if (!changes.ingredients?.items || 
            !Array.isArray(changes.ingredients.items) || 
            changes.ingredients.items.length === 0) {
          if (!changes.ingredients) changes.ingredients = { mode: "none", items: [] };
          changes.ingredients.mode = "none";
        }
        
        // Ensure we have at least some science notes
        if (!Array.isArray(scienceNotes) || scienceNotes.length === 0) {
          // Extract potential science notes from the text response
          scienceNotes = extractScienceNotesFromText(textResponse);
        }
      }
      
      // For analysis requests, make sure we include the extracted sections in the response
      const responseData = sourceType === 'analysis' 
        ? { 
            success: true, 
            changes,
            science_notes: scienceNotes,
            techniques: techniques,
            troubleshooting: troubleshooting,
            followUpQuestions: followUpQuestions,
            textResponse: textResponse // Include text response for fallback
          }
        : { 
            success: true, 
            changes, 
            textResponse, 
            followUpQuestions 
          };

      // Store the chat interaction if it's not an analysis
      if (sourceType !== 'analysis' && recipe.id) {
        // Create meta object for optimistic updates tracking
        const meta = messageId ? { optimistic_id: messageId } : {};
        
        try {
          const { error: chatError } = await supabaseClient
            .from('recipe_chats')
            .insert({
              recipe_id: recipe.id,
              user_message: userMessage,
              ai_response: textResponse,
              changes_suggested: changes,
              source_type: sourceType || 'manual',
              source_url: sourceUrl,
              source_image: sourceImage,
              meta: meta
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

      // Use getCorsHeadersWithOrigin for proper credentials handling
      return new Response(
        JSON.stringify(responseData),
        {
          headers: {
            ...getCorsHeadersWithOrigin(req),
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (aiError) {
      console.error("Error with OpenAI request:", aiError);
      throw new Error(`OpenAI request failed: ${aiError.message}`);
    }
  } catch (error) {
    console.error("Error in recipe-chat function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...getCorsHeadersWithOrigin(req),
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
