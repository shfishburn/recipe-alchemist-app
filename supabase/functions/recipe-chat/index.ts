
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'
import { validateRecipeChanges } from './validation.ts'
import { recipeAnalysisPrompt, chatSystemPrompt } from '../_shared/recipe-prompts.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestData = await req.json()
    const { recipe, userMessage, sourceType, sourceUrl, sourceImage } = requestData
    
    // Validate required parameters
    if (!recipe || !recipe.id) {
      console.error("Missing recipe data in request")
      throw new Error("Recipe data is required")
    }
    
    if (!userMessage) {
      console.error("Missing user message in request")
      throw new Error("User message is required")
    }
    
    console.log(`Processing recipe chat request for recipe ${recipe.id} with message: ${userMessage.substring(0, 50)}...`)
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Use the appropriate prompt based on the source type
    const systemPrompt = sourceType === 'analysis' ? recipeAnalysisPrompt : chatSystemPrompt;

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set')
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
    `

    console.log(`Sending request to OpenAI with ${prompt.length} characters`)

    try {
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
              content: systemPrompt + "\nIMPORTANT: Provide responses in a conversational tone. For analysis requests, make sure to include explicit sections for science notes, techniques, and troubleshooting.",
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2500, // Increased max tokens to ensure complete responses
          n: 1,
          stop: null,
        }),
      }).then((res) => res.json())
      
      if (!aiResponse.choices || !aiResponse.choices[0] || !aiResponse.choices[0].message) {
        console.error("Invalid AI response structure:", aiResponse);
        throw new Error("Failed to get a valid response from OpenAI");
      }
      
      const rawResponse = aiResponse.choices[0].message.content;
      console.log("Raw AI response:", rawResponse.substring(0, 200) + "...");

      // Extract any changes suggested from the response
      const processedResponse = validateRecipeChanges(rawResponse);
      
      // Prepare the response data format
      let textResponse = rawResponse;
      let changes = { mode: "none" };
      let scienceNotes = [];
      let techniques = [];
      let troubleshooting = [];
      
      // Check if we successfully extracted structured changes
      if (processedResponse && typeof processedResponse === 'object') {
        if (processedResponse.textResponse) {
          textResponse = processedResponse.textResponse;
        }
        if (processedResponse.changes) {
          // Add safety check for empty or missing ingredients
          if (processedResponse.changes.ingredients) {
            if (!processedResponse.changes.ingredients.mode) {
              processedResponse.changes.ingredients.mode = "none";
            }
            if (!processedResponse.changes.ingredients.items || 
                !Array.isArray(processedResponse.changes.ingredients.items) ||
                processedResponse.changes.ingredients.items.length === 0) {
              processedResponse.changes.ingredients.mode = "none";
              processedResponse.changes.ingredients.items = [];
            }
          }
          changes = processedResponse.changes;
        }
        // Extract analysis sections if available
        if (processedResponse.science_notes) {
          scienceNotes = processedResponse.science_notes;
        }
        if (processedResponse.techniques) {
          techniques = processedResponse.techniques;
        }
        if (processedResponse.troubleshooting) {
          troubleshooting = processedResponse.troubleshooting;
        }
      }
      
      console.log("Processed response:", { 
        textLength: textResponse.length, 
        hasChanges: !!changes,
        scienceNotesCount: scienceNotes.length,
        techniquesCount: techniques.length,
        troubleshootingCount: troubleshooting.length,
        ingredientsMode: changes.ingredients?.mode || 'none',
        hasIngredients: Array.isArray(changes.ingredients?.items) && changes.ingredients?.items.length > 0
      });
      
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
            textResponse: textResponse // Include text response for fallback
          }
        : { success: true, changes, textResponse };

      // Store the chat interaction if it's not an analysis
      if (sourceType !== 'analysis' && recipe.id) {
        const { error: chatError } = await supabaseClient
          .from('recipe_chats')
          .insert({
            recipe_id: recipe.id,
            user_message: userMessage,
            ai_response: textResponse,
            changes_suggested: changes,
            source_type: sourceType || 'manual',
            source_url: sourceUrl,
            source_image: sourceImage
          })

        if (chatError) {
          console.error("Error storing chat:", chatError);
          throw chatError;
        }
      }

      return new Response(
        JSON.stringify(responseData),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
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
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})

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
