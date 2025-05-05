
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { recipe_id, title, instructions } = await req.json();

    // Validate input
    if (!recipe_id || !Array.isArray(instructions) || instructions.length === 0) {
      throw new Error("Missing required parameters or invalid instructions format");
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if analysis already exists
    const { data: existingAnalysis } = await supabase
      .from('recipe_step_reactions')
      .select('step_index')
      .eq('recipe_id', recipe_id);

    if (existingAnalysis && existingAnalysis.length > 0) {
      console.log(`Analysis already exists for recipe ${recipe_id}, deleting...`);
      
      // Delete existing analysis to replace it
      const { error: deleteError } = await supabase
        .from('recipe_step_reactions')
        .delete()
        .eq('recipe_id', recipe_id);

      if (deleteError) {
        console.error("Error deleting existing analysis:", deleteError);
        throw new Error("Failed to delete existing analysis");
      }
    }

    // System prompt for analyzing recipe steps
    const systemPrompt = `You are a culinary scientist specializing in food chemistry and cooking techniques. 
    Analyze each recipe step to identify chemical reactions, cooking processes, and scientific principles at work. 
    
    For each step, provide:
    1. The key reactions occurring (e.g., maillard_reaction, protein_denaturation, etc.)
    2. A brief scientific explanation of what's happening
    3. An identification of the cooking method being used
    4. The temperature range in Celsius (if applicable)
    
    Return your analysis as structured JSON with this format:
    {
      "step_analyses": [
        {
          "step_index": 0,
          "reactions": ["reaction_type1", "reaction_type2"],
          "reaction_details": ["Scientific explanation in 1-2 sentences"],
          "cooking_method": "method_name",
          "temperature_celsius": 175,
          "duration_minutes": 15,
          "metadata": {
            "temperatureNote": "Optional note about temperature significance",
            "techniqueImportance": "Optional note about why technique matters",
            "additionalDetail": "Any other relevant scientific details"
          }
        }
      ]
    }
    
    Use snake_case for reaction types. Keep explanations concise, evidence-based, and focused on chemistry/physics.`;

    // User message containing the recipe steps to analyze
    const userMessage = `Analyze the scientific principles in each step of this recipe titled "${title}":

    ${instructions.map((step: string, index: number) => `Step ${index + 1}: ${step}`).join('\n\n')}
    
    Give a structured response following the required JSON format.`;

    // Call OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not found');
    }

    console.log("Calling OpenAI to analyze recipe steps...");
    
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }, // Enforce JSON output
        max_tokens: 2000,
      }),
    }).then(res => res.json());

    if (!openAIResponse.choices || !openAIResponse.choices[0]?.message?.content) {
      throw new Error("Invalid response from OpenAI");
    }

    const analysisContent = openAIResponse.choices[0].message.content;
    console.log("Analysis received from OpenAI:", analysisContent.substring(0, 100) + "...");

    // Parse the JSON response (should be direct JSON now)
    let analysis;
    try {
      analysis = JSON.parse(analysisContent);
    } catch (e) {
      console.error("Failed to parse OpenAI response as JSON:", e);
      throw new Error("Failed to parse OpenAI response");
    }

    if (!analysis.step_analyses || !Array.isArray(analysis.step_analyses)) {
      throw new Error("Invalid analysis structure from OpenAI");
    }

    console.log(`Processing ${analysis.step_analyses.length} step analyses`);

    // Prepare step reactions for database
    const stepReactions = analysis.step_analyses.map(stepAnalysis => ({
      recipe_id,
      step_index: stepAnalysis.step_index,
      step_text: instructions[stepAnalysis.step_index],
      reactions: stepAnalysis.reactions || [],
      reaction_details: stepAnalysis.reaction_details || [],
      cooking_method: stepAnalysis.cooking_method || null,
      temperature_celsius: stepAnalysis.temperature_celsius || null,
      duration_minutes: stepAnalysis.duration_minutes || null,
      confidence: stepAnalysis.confidence || 0.9,
      ai_model: 'gpt-4o',
      version: '2.0',
      metadata: stepAnalysis.metadata || {}
    }));

    // Insert step reactions into database
    const { error: insertError } = await supabase
      .from('recipe_step_reactions')
      .insert(stepReactions);

    if (insertError) {
      console.error("Error inserting step reactions:", insertError);
      throw new Error("Failed to save analysis");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Analyzed ${stepReactions.length} recipe steps`,
        step_count: stepReactions.length
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error("Error in analyze-reactions:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "An unexpected error occurred"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
