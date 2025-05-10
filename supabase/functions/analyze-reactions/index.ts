import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Refined and expanded system prompt for analyzing recipe steps with more complete detailed output
const systemPrompt = `You are a culinary scientist analyzing recipes with scientific rigor in the tradition of Harold McGee, Kenji López-Alt, and Nathan Myhrvold.

For each step provide DETAILED scientific analysis including:
1. REACTIONS: Identify ALL relevant chemical processes from: [maillard_reaction, caramelization, protein_denaturation, emulsification, gelatinization, coagulation, enzymatic_browning, fermentation, hydration, acid_base_reaction, fat_rendering, crystallization, starch_gelatinization, flavor_extraction, volatile_release, collagen_hydrolysis, osmosis]
2. METHODS: Precisely classify the cooking method from: [roasting, baking, sautéing, frying, boiling, simmering, steaming, braising, poaching, grilling, broiling, sous_vide, pressure_cooking, blanching, stir_frying, microwaving]
3. TEMPERATURES: Always specify exact temperatures in °C with corresponding °F values
4. DURATIONS: Always specify timing in minutes for every applicable step
5. DETAILED MECHANISMS: Explain the molecular transformations occurring in each step
6. TROUBLESHOOTING: Provide specific solutions to common problems

Return complete JSON with these fields for EVERY step (no fallbacks or placeholders):
{
  "step_analyses": [
    {
      "step_index": 0,
      "step_text": "The step text",
      "reactions": ["reaction1", "reaction2"],
      "reaction_details": ["Detailed scientific explanation of reactions with temperatures and timing"],
      "cooking_method": "Specific method name",
      "temperature_celsius": 180,
      "duration_minutes": 25,
      "confidence": 0.95,
      "chemical_systems": {
        "primary_reactions": ["detailed_reaction1", "detailed_reaction2"],
        "secondary_reactions": ["reaction3"],
        "reaction_mechanisms": "Specific mechanism explanation with molecular details",
        "critical_compounds": ["compound1", "compound2"],
        "ph_effects": {"range": "pH 5.2-6.0", "impact": "Detailed explanation"}
      },
      "thermal_engineering": {
        "heat_transfer_mode": "convection/conduction/radiation",
        "thermal_gradient": "Specific gradient description",
        "temperature_profile": {"surface": 190, "core": 165, "unit": "celsius"},
        "heat_capacity_considerations": "Detailed thermal physics explanation"
      },
      "process_parameters": {
        "critical_times": {
          "minimum": 20,
          "optimal": 25,
          "maximum": 30,
          "unit": "minutes"
        },
        "tolerance_windows": {
          "temperature": "+/- 10°C",
          "time": "+/- 2 minutes",
          "humidity": "45-55%"
        }
      },
      "troubleshooting_matrix": [
        {
          "problem": "specific_issue_name",
          "diagnostic_tests": ["Visual indicator", "Texture test"],
          "corrections": ["Precise adjustment with temperature", "Detailed time modification"],
          "prevention": ["Specific technique to avoid the problem"]
        }
      ],
      "safety_protocols": {
        "critical_limits": "HACCP limits with exact temperatures",
        "allergen_concerns": "Specific allergen warnings"
      }
    }
  ],
  "global_analysis": {
    "cascade_effects": "How each step builds on previous steps"
  }
}

CRITICAL RULES:
- EVERY step MUST have detailed reactions, specific reaction_details, and precise cooking_method
- Temperature and duration MUST be provided with exact values for all applicable steps
- Use CONSISTENT reaction types as listed above
- Fill ALL fields with substantive scientific content - NO placeholders or "not available" responses
- Focus on molecular gastronomy principles and precise cooking science`;

// Creates a more informative and unique fallback analysis structure
function createFallbackAnalysis(instructions) {
  // Create a timestamp to make each fallback unique
  const timestamp = new Date().toISOString();
  
  const fallbackData = {
    step_analyses: instructions.map((step, index) => {
      // Extract cooking terms to make more specific fallbacks
      const lowerStep = step.toLowerCase();
      
      // Determine likely cooking method based on keywords
      let cookingMethod = "unknown";
      let reactions = ["basic_cooking"];
      let temperature = null;
      let duration = null;
      
      // Simple keyword detection to improve fallbacks
      if (lowerStep.includes("bake") || lowerStep.includes("oven")) {
        cookingMethod = "baking";
        reactions = ["maillard_reaction", "caramelization"];
        temperature = 180;
      } else if (lowerStep.includes("boil")) {
        cookingMethod = "boiling";
        reactions = ["hydration", "protein_denaturation"];
        temperature = 100;
      } else if (lowerStep.includes("simmer")) {
        cookingMethod = "simmering";
        reactions = ["hydration", "flavor_development"];
        temperature = 85;
      } else if (lowerStep.includes("fry")) {
        cookingMethod = "frying";
        reactions = ["maillard_reaction", "fat_rendering"];
        temperature = 175;
      } else if (lowerStep.includes("grill")) {
        cookingMethod = "grilling";
        reactions = ["maillard_reaction", "caramelization"];
        temperature = 230;
      }
      
      // Look for time indicators
      const timeMatch = step.match(/(\d+)[\s-]*(minute|min|hour|hr|second|sec)/i);
      if (timeMatch) {
        const amount = parseInt(timeMatch[1]);
        const unit = timeMatch[2].toLowerCase();
        if (unit.includes("hour") || unit.includes("hr")) {
          duration = amount * 60;
        } else if (unit.includes("min")) {
          duration = amount;
        } else if (unit.includes("sec")) {
          duration = amount / 60;
        }
      }
      
      return {
        step_index: index,
        step_text: step,
        reactions: reactions,
        reaction_details: [`Scientifically, this step involves ${reactions.join(", ")}. This analysis is a recovery fallback.`],
        cooking_method: cookingMethod,
        temperature_celsius: temperature,
        duration_minutes: duration,
        confidence: 0.6,
        chemical_systems: {
          primary_reactions: reactions,
          secondary_reactions: [],
          reaction_mechanisms: "Mechanism details not available in fallback mode",
          critical_compounds: [],
        },
        thermal_engineering: {
          heat_transfer_mode: cookingMethod === "baking" ? "convection" : 
                              cookingMethod === "boiling" ? "conduction" : 
                              "multiple",
          thermal_gradient: "unknown",
        },
        process_parameters: {
          critical_times: {
            minimum: duration ? Math.floor(duration * 0.8) : null,
            optimal: duration,
            maximum: duration ? Math.ceil(duration * 1.2) : null,
            unit: "minutes"
          }
        },
        troubleshooting_matrix: [
          {
            problem: "analysis_recovery",
            diagnostic_tests: ["Check if analysis persistence is working"],
            corrections: ["Refresh the page"],
            prevention: ["Ensure stable connection during analysis"]
          }
        ],
        safety_protocols: {
          critical_limits: "Follow recipe instructions carefully",
          allergen_concerns: "Check ingredients for allergens"
        },
        metadata: {
          generatedByFallback: true,
          fallbackTimestamp: timestamp,
          fallbackReason: "OpenAI parsing error recovery"
        }
      };
    }),
    global_analysis: {
      cascade_effects: "Analysis of cascade effects not available in fallback mode",
      scaling_considerations: "Default scaling applies",
      energy_efficiency: "Use standard cooking practices",
      process_flow_optimization: "Follow recipe steps in order",
      equipment_integration: "Use equipment as specified in recipe"
    }
  };
  
  return fallbackData;
}

// Function to safely parse JSON with multiple fallback attempts
function safelyParseJSON(jsonString) {
  // First try direct parsing
  try {
    return JSON.parse(jsonString);
  } catch (initialError) {
    console.log("Initial JSON parsing failed, attempting recovery...");
    
    try {
      // Look for a valid JSON object starting with {
      const jsonMatch = jsonString.match(/{[\s\S]*}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (matchError) {
      console.log("JSON object extraction failed:", matchError);
    }
    
    try {
      // Clean up common JSON errors and try again
      const cleanedJson = jsonString
        .replace(/\n/g, ' ')
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']')
        .replace(/([{,])\s*(\w+):/g, '$1"$2":')
        .replace(/:\s*'([^']*)'/g, ':"$1"');
      
      return JSON.parse(cleanedJson);
    } catch (cleanError) {
      console.log("Cleaned JSON parsing failed:", cleanError);
      throw initialError; // Re-throw the original error
    }
  }
}

// Function to retry OpenAI calls with exponential backoff
async function retryOpenAI(url, options, maxRetries = 3) {
  let lastError;
  let delay = 1000;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Retry attempt ${attempt} after ${delay}ms delay`);
      }
      
      const response = await fetch(url, options);
      if (response.ok) {
        const responseData = await response.json();
        return {
          ...responseData,
          retried: attempt > 0,
          retryAttempts: attempt
        };
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
    
    Give a structured response following the required JSON format with practical scientific details.`;

    // Call OpenAI with retry mechanism
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not found');
    }

    console.log("Calling OpenAI to analyze recipe steps with enhanced scientific prompt...");
    
    let openAIResponse;
    let analysisContent;
    let parsedAnalysis;
    
    try {
      // Use a more reliable model (gpt-4o) to improve response quality
      openAIResponse = await retryOpenAI('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o', // Using a more reliable model for better JSON formatting
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.5, // Lower temperature for more consistent output
          response_format: { type: "json_object" }, // Enforce JSON output
          max_tokens: 4000, // Adequate tokens for detailed analysis
        }),
      });
      
      if (!openAIResponse.choices || !openAIResponse.choices[0]?.message?.content) {
        throw new Error("Invalid response from OpenAI");
      }

      analysisContent = openAIResponse.choices[0].message.content;
      console.log("Analysis received from OpenAI:", analysisContent.substring(0, 200) + "...");
      
      // Try to parse the JSON with our enhanced safety function
      try {
        parsedAnalysis = safelyParseJSON(analysisContent);
        console.log("Successfully parsed OpenAI JSON response");
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", parseError);
        throw new Error("JSON parsing failed");
      }
      
    } catch (error) {
      console.error("OpenAI API or parsing error:", error);
      console.log("Using enhanced fallback analysis due to OpenAI error");
      parsedAnalysis = createFallbackAnalysis(instructions);
    }

    // Validate the parsed analysis structure
    if (!parsedAnalysis || !parsedAnalysis.step_analyses || !Array.isArray(parsedAnalysis.step_analyses)) {
      console.log("Invalid analysis structure after parsing, using fallback");
      parsedAnalysis = createFallbackAnalysis(instructions);
    }

    console.log(`Processing ${parsedAnalysis.step_analyses.length} step analyses with enhanced data`);

    // Extract global analysis if present
    const globalAnalysis = parsedAnalysis.global_analysis || {};

    // Prepare step reactions for database using the new columns structure
    const stepReactions = parsedAnalysis.step_analyses.map((stepAnalysis, index) => {
      // Ensure step_index exists and is valid
      const step_index = typeof stepAnalysis.step_index === 'number' ? 
        stepAnalysis.step_index : index;
      
      // Ensure step_text is a string
      const step_text = instructions[step_index] || `Step ${step_index + 1}`;
      
      // Ensure reactions is an array of strings
      const reactions = Array.isArray(stepAnalysis.reactions) ? 
        stepAnalysis.reactions : ["basic_cooking"];
      
      // Ensure reaction_details is an array of strings
      const reaction_details = Array.isArray(stepAnalysis.reaction_details) ? 
        stepAnalysis.reaction_details : ["No detailed analysis available"];
      
      return {
        recipe_id,
        step_index,
        step_text,
        reactions,
        reaction_details,
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
          model: 'gpt-4o',
          generatedAt: new Date().toISOString(),
          source: openAIResponse ? "openai" : "fallback"
        },
        ai_model: 'gpt-4o',
        version: '3.1' // Increment version to track these improvements
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
        used_fallback: !openAIResponse,
        version: '3.1'
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
