
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

    // Enhanced system prompt for analyzing recipe steps with scientific rigor
    const systemPrompt = `You are an authoritative culinary scientist with expertise spanning food chemistry, physics, and engineering, drawing from methodologies of Harold McGee, J. Kenji López-Alt, and Nathan Myhrvold's modernist cuisine principles.

Analyze each recipe step with scientific rigor, considering chemical reactions, thermal properties, and process parameters.

For each step, provide comprehensive scientific analysis including:

1. CHEMICAL SYSTEMS:
   - Primary and secondary reactions (e.g., maillard_reaction, protein_denaturation)
   - Reaction mechanisms and critical compounds
   - pH effects and water activity considerations

2. THERMAL ENGINEERING:
   - Heat transfer modes (conduction, convection, radiation)
   - Temperature profiles and thermal gradients
   - Heat capacity considerations and thermal behavior

3. PROCESS PARAMETERS:
   - Critical time ranges (minimum, optimal, maximum)
   - Temperature tolerance windows
   - Humidity and other environmental factors

4. TROUBLESHOOTING MATRIX:
   - Potential problems and their causes
   - Diagnostic tests and indicators
   - Corrective actions and prevention strategies

Return structured JSON with the following format:
{
  "step_analyses": [
    {
      "step_index": 0,
      "step_text": "The instruction text",
      "reactions": ["maillard_reaction", "caramelization"],
      "reaction_details": ["Scientific explanation of what's happening"],
      "cooking_method": "roasting",
      "temperature_celsius": 180,
      "duration_minutes": 25,
      "confidence": 0.95,
      "chemical_systems": {
        "primary_reactions": ["maillard_reaction"],
        "secondary_reactions": ["caramelization"],
        "reaction_mechanisms": "Detailed explanation of reaction pathways",
        "critical_compounds": ["glucose", "amino_acids"],
        "ph_effects": {
          "range": "5.5-6.5",
          "impact": "Affects browning rate and flavor development"
        },
        "water_activity": {
          "value": 0.95,
          "significance": "Controls texture development"
        }
      },
      "thermal_engineering": {
        "heat_transfer_mode": "convection",
        "thermal_gradient": "15°C/cm",
        "temperature_profile": {
          "surface": 190,
          "core": 165,
          "unit": "celsius"
        },
        "heat_capacity_considerations": "Metal pan vs ceramic effects"
      },
      "process_parameters": {
        "critical_times": {
          "minimum": 20,
          "optimal": 25,
          "maximum": 30,
          "unit": "minutes"
        },
        "tolerance_windows": {
          "temperature": "±10°C",
          "time": "±3 minutes",
          "humidity": "±5%"
        }
      },
      "troubleshooting_matrix": [
        {
          "problem": "undercooking",
          "diagnostic_tests": ["Internal temperature check"],
          "corrections": ["Extend cooking time by 5 minutes"],
          "prevention": ["Use oven thermometer to verify temperature"]
        }
      ],
      "safety_protocols": {
        "critical_limits": "Internal temperature must reach at least 74°C (165°F)",
        "allergen_concerns": "Contains wheat proteins that may trigger gluten sensitivity"
      },
      "metadata": {
        "temperatureNote": "Lower temperature for fan-assisted ovens by 20°C",
        "techniqueImportance": "Preheating is critical for proper crust formation"
      }
    }
  ],
  "global_analysis": {
    "cascade_effects": "How steps interact and influence each other",
    "scaling_considerations": "How recipe responds to doubling or halving quantities",
    "energy_efficiency": "Tips for reducing energy use in preparation",
    "process_flow_optimization": "Sequence and timing improvements",
    "equipment_integration": "Ideal tool combinations for this recipe"
  }
}

Provide physics-based, chemistry-grounded analysis with practical applications. Always include temperature in both Celsius and Fahrenheit. Focus on actionable insights that improve cooking outcomes.`;

    // User message containing the recipe steps to analyze
    const userMessage = `Analyze the scientific principles in each step of this recipe titled "${title}":

    ${instructions.map((step: string, index: number) => `Step ${index + 1}: ${step}`).join('\n\n')}
    
    Give a structured response following the required JSON format with comprehensive scientific details.`;

    // Call OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not found');
    }

    console.log("Calling OpenAI to analyze recipe steps with enhanced scientific prompt...");
    
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
        max_tokens: 3000, // Increased token limit for more detailed analysis
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

    console.log(`Processing ${analysis.step_analyses.length} step analyses with enhanced data`);

    // Extract global analysis if present
    const globalAnalysis = analysis.global_analysis || {};

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
      chemical_systems: stepAnalysis.chemical_systems || null,
      thermal_engineering: stepAnalysis.thermal_engineering || null,
      process_parameters: stepAnalysis.process_parameters || null,
      troubleshooting_matrix: stepAnalysis.troubleshooting_matrix || null,
      safety_protocols: stepAnalysis.safety_protocols || null,
      ai_model: 'gpt-4o',
      version: '3.0',
      metadata: {
        ...(stepAnalysis.metadata || {}),
        global_analysis: globalAnalysis
      }
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
        message: `Analyzed ${stepReactions.length} recipe steps with enhanced scientific data`,
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
