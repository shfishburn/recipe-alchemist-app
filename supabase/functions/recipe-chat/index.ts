import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'
import { validateRecipeChanges } from './validation.ts'

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
    const { recipeId, userMessage } = await req.json()
    
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

    // Your existing OpenAI call here with updated system prompt
    const systemPrompt = `You are a helpful cooking assistant. When suggesting changes to recipes:
    1. Always format responses as JSON with changes
    2. For cooking instructions:
       - Include specific temperatures (F° and C°)
       - Specify cooking durations
       - Add equipment setup details
       - Include doneness indicators for proteins
       - Add resting times when needed
    3. Format ingredients with exact measurements
    4. Validate all titles are descriptive and clear
    
    Example format:
    {
      "title": "Herb-Crusted Chicken Breast",
      "ingredients": [
        {
          "qty": 2,
          "unit": "lb",
          "item": "chicken breast",
          "notes": "boneless, skinless"
        }
      ],
      "instructions": [
        "Preheat the oven to 400°F (200°C)",
        "Season chicken breast with salt and pepper",
        "Cook for 25-30 minutes until internal temperature reaches 165°F (74°C)",
        "Let rest for 5-10 minutes before slicing"
      ],
      "cookingDetails": {
        "temperature": {
          "fahrenheit": 400,
          "celsius": 200
        },
        "duration": {
          "prep": 10,
          "cook": 30,
          "rest": 10
        },
        "equipment": [
          {
            "type": "oven",
            "settings": "conventional bake"
          }
        ]
      }
    }`

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    const prompt = `
    You are a helpful cooking assistant. The user is asking for changes to a recipe.
    The current recipe is:
    ${JSON.stringify(recipe)}

    The user is asking for the following changes:
    ${userMessage}

    Please suggest changes to the recipe in JSON format.
    `

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
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

    // Validate the response
    const changes = validateRecipeChanges(aiResponse)
    
    // Store the chat interaction
    const { error: chatError } = await supabaseClient
      .from('recipe_chats')
      .insert({
        recipe_id: recipeId,
        user_message: userMessage,
        ai_response: JSON.stringify(changes),
        changes_suggested: changes
      })

    if (chatError) throw chatError

    return new Response(
      JSON.stringify({ success: true, changes }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
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
