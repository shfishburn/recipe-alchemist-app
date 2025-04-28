
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

    // Modify system prompt based on the source type
    let systemPrompt = `You are a helpful cooking assistant. When suggesting changes to recipes:
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

    // If this is an analysis request, enhance the system prompt
    if (sourceType === 'analysis') {
      systemPrompt = `${systemPrompt}
      
      You are performing a scientific analysis of a recipe. Your response must include:
      1. An improved, more specific recipe title that highlights key techniques or flavors
      2. At least 3 detailed scientific notes about the cooking chemistry
      3. The response must be formatted as valid JSON
      
      The improved title should be descriptive but concise and should NEVER be generic like "optional new title" or "untitled recipe".
      
      Example response format:
      {
        "title": "Slow-Braised Short Ribs with Red Wine Reduction",
        "science_notes": [
          "The Maillard reaction during initial searing creates complex flavor compounds and improves color",
          "Slow braising at 275°F (135°C) allows collagen to convert to gelatin for tender meat",
          "Acidic components in wine denature proteins and tenderize tough connective tissue"
        ],
        "techniques": [
          "Proper searing requires a dry surface and high heat (450°F+) to achieve browning",
          "Low and slow cooking (275°F) promotes collagen breakdown without moisture loss"
        ],
        "troubleshooting": [
          "If meat is tough, extend cooking time by 30-45 minutes to allow more collagen conversion",
          "If sauce is thin, reduce separately at a simmer until it coats the back of a spoon"
        ]
      }`
    }

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
