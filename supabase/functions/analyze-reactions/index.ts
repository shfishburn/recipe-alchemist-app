
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
        }
      },
      "thermal_engineering": {
        "heat_transfer_mode": "convection",
        "thermal_gradient": "15°C/cm"
      },
      "process_parameters": {
        "critical_times": {
          "minimum": 20,
          "optimal": 25,
          "maximum": 30,
          "unit": "minutes"
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
        "critical_limits": "Internal temperature must reach at least 74°C (165°F)"
      }
    }
  ],
  "global_analysis": {
    "cascade_effects": "How steps interact and influence each other"
  }
}`;

// Creates a fallback analysis structure when OpenAI fails
function createFallbackAnalysis(instructions) {
  const fallbackData = {
    step_analyses: instructions.map((step, index) => ({
      step_index: index,
      step_text: step,
      reactions: ["basic_cooking"],
      reaction_details: ["Automatic fallback analysis"],
      cooking_method: "unknown",
      temperature_celsius: null,
      duration_minutes: null,
      confidence: 0.5,
      chemical_systems: {
        primary_reactions: [],
        secondary_reactions: [],
        reaction_mechanisms: "Not analyzed",
        critical_compounds: [],
      },
      thermal_engineering: {
        heat_transfer_mode: "unknown",
        thermal_gradient: "unknown",
      },
      process_parameters: {
        critical_times: {
          minimum: 0,
          optimal: 0,
          maximum: 0,
          unit: "minutes"
        }
      },
      troubleshooting_matrix: [
        {
          problem: "analysis_failed",
          diagnostic_tests: ["Retry analysis"],
          corrections: ["Try again later"],
          prevention: ["No prevention steps available"]
        }
      ],
      safety_protocols: {
        critical_limits: "Follow recipe instructions carefully",
        allergen_concerns: "Check ingredients for allergens"
      },
      metadata: {
        generatedByFallback: true
      }
    })),
    global_analysis: {
      cascade_effects: "No cascade effects analyzed",
      scaling_considerations: "Default scaling applies",
      energy_efficiency: "Use standard cooking practices",
      process_flow_optimization: "Follow recipe steps in order",
      equipment_integration: "Use equipment as specified in recipe"
    }
  };
  
  return fallbackData;
}

// Function to retry OpenAI calls with exponential backoff
async function retryOpenAI(url, options, maxRetries = 2) {
  let lastError;
  let delay = 1000;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Retry attempt ${attempt} after ${delay}ms delay`);
      }
      
      const response = await fetch(url, options);
      if (response.ok) {
        return await response.json();
      }
      
      // If response is not OK, get error details
      let errorBody = "Unknown error";
      try {
        errorBody = await response.text();
      } catch {
        // Ignore error reading response
      }
      
      lastError = new Error(`OpenAI API error (${response.status}): ${errorBody}`);
      
      // Don't retry on certain status codes
      if (response.status === 400 || response.status === 401 || response.status === 429) {
        throw lastError;
      }
    } catch (error) {
      lastError = error;
    }
    
    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, delay));
    delay *= 2; // Exponential backoff
  }
  
  throw lastError;
}

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

    // User message containing the recipe steps to analyze
    const userMessage = `Analyze the scientific principles in each step of this recipe titled "${title}":

    ${instructions.map((step, index) => `Step ${index + 1}: ${step}`).join('\n\n')}
    
    Give a structured response following the required JSON format with comprehensive scientific details.`;

    // Call OpenAI with retry mechanism
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not found');
    }

    console.log("Calling OpenAI to analyze recipe steps with enhanced scientific prompt...");
    
    let openAIResponse;
    let analysisContent;
    
    try {
      // Use a lighter model (gpt-4o-mini) to improve performance
      openAIResponse = await retryOpenAI('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Changed from gpt-4o to improve performance
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.7,
          response_format: { type: "json_object" }, // Enforce JSON output
          max_tokens: 3000, // Increased token limit for more detailed analysis
        }),
      });
      
      if (!openAIResponse.choices || !openAIResponse.choices[0]?.message?.content) {
        throw new Error("Invalid response from OpenAI");
      }

      analysisContent = openAIResponse.choices[0].message.content;
      console.log("Analysis received from OpenAI:", analysisContent.substring(0, 100) + "...");
      
    } catch (error) {
      console.error("OpenAI API error:", error);
      console.log("Using fallback analysis due to OpenAI error");
      analysisContent = JSON.stringify(createFallbackAnalysis(instructions));
    }

    // Parse the JSON response with better error handling
    let analysis;
    try {
      analysis = JSON.parse(analysisContent);
      
      // If parsing succeeds but we don't have the expected structure, use fallback
      if (!analysis.step_analyses || !Array.isArray(analysis.step_analyses)) {
        console.log("Invalid analysis structure, using fallback");
        analysis = createFallbackAnalysis(instructions);
      }
    } catch (e) {
      console.error("Failed to parse OpenAI response:", e);
      analysis = createFallbackAnalysis(instructions);
    }

    console.log(`Processing ${analysis.step_analyses.length} step analyses with enhanced data`);

    // Extract global analysis if present
    const globalAnalysis = analysis.global_analysis || {};

    // Prepare step reactions for database using the new columns structure
    const stepReactions = analysis.step_analyses.map((stepAnalysis, index) => {
      // Ensure step_index exists and is valid
      const step_index = typeof stepAnalysis.step_index === 'number' ? 
        stepAnalysis.step_index : index;
      
      // Ensure step_text is a string
      const step_text = instructions[step_index] || `Step ${step_index + 1}`;
      
      return {
        recipe_id,
        step_index,
        step_text,
        reactions: Array.isArray(stepAnalysis.reactions) ? stepAnalysis.reactions : [],
        reaction_details: Array.isArray(stepAnalysis.reaction_details) ? stepAnalysis.reaction_details : [],
        cooking_method: stepAnalysis.cooking_method || null,
        temperature_celsius: stepAnalysis.temperature_celsius || null,
        duration_minutes: stepAnalysis.duration_minutes || null,
        confidence: stepAnalysis.confidence || 0.9,
        // Use our new JSONB columns for complex data
        chemical_systems: stepAnalysis.chemical_systems || null,
        thermal_engineering: stepAnalysis.thermal_engineering || null,
        process_parameters: stepAnalysis.process_parameters || null,
        troubleshooting_matrix: stepAnalysis.troubleshooting_matrix || null,
        safety_protocols: stepAnalysis.safety_protocols || null,
        // Store any other data in metadata
        metadata: {
          global_analysis: globalAnalysis,
          retried: !!openAIResponse?.retried,
          model: 'gpt-4o-mini'
        },
        ai_model: 'gpt-4o-mini', // Use the lighter model
        version: '3.0'
      };
    });

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
        step_count: stepReactions.length,
        used_fallback: !openAIResponse
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
        error: error.message || "An unexpected error occurred",
        stack: error.stack
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
