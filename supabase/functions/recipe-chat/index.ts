import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'
import { validateRecipeChanges } from './validation.ts'
import { recipeAnalysisPrompt, chatSystemPrompt } from '../_shared/recipe-prompts.ts'

interface RecipeChanges {
  ingredients?: {
    qty: number;
    unit: string;
    item: string;
    notes?: string;
  }[];
  instructions?: string[];
  title?: string;
  cookingDetails?: {
    temperature?: {
      fahrenheit: number;
      celsius: number;
    };
    duration?: {
      prep: number;
      cook: number;
      rest?: number;
    };
    equipment?: {
      type: string;
      settings?: string;
    }[];
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { recipeId, userMessage, sourceType } = await req.json()
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the current recipe
    const { data: recipe, error: recipeError } = await supabaseClient
      .from('recipes')
      .select('*')
      .eq('id', recipeId)
      .single()

    if (recipeError) throw recipeError

    // Use the appropriate prompt based on the source type
    const systemPrompt = sourceType === 'analysis' ? recipeAnalysisPrompt : chatSystemPrompt;

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    const prompt = `
    Current recipe:
    ${JSON.stringify(recipe)}

    User request:
    ${userMessage}

    Please analyze and suggest changes in JSON format.
    `

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
            content: systemPrompt,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
        n: 1,
        stop: null,
      }),
    }).then((res) => res.json()).then((json) => json.choices[0].message.content)

    console.log("Raw AI response:", aiResponse);

    // Validate the response
    const changes = validateRecipeChanges(aiResponse)
    console.log("Validated changes:", changes);
    
    // For analysis requests, make sure we include the changes in the response
    const responseData = sourceType === 'analysis' 
      ? { 
          success: true, 
          changes,
          science_notes: changes.science_notes || [],
          techniques: changes.techniques || [],
          troubleshooting: changes.troubleshooting || [] 
        }
      : { success: true, changes };

    // Store the chat interaction if it's not an analysis
    if (sourceType !== 'analysis') {
      const { error: chatError } = await supabaseClient
        .from('recipe_chats')
        .insert({
          recipe_id: recipeId,
          user_message: userMessage,
          ai_response: JSON.stringify(changes),
          changes_suggested: changes
        })

      if (chatError) throw chatError
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
