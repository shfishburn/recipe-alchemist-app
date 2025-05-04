
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import OpenAI from "https://esm.sh/openai@4.0.0";

const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipe_id, title, instructions } = await req.json();
    
    if (!recipe_id || !title || !instructions || !Array.isArray(instructions)) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: recipe_id, title, or instructions" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Analyzing recipe: ${title} (${recipe_id}) with ${instructions.length} steps`);

    const systemPrompt = `You are a culinary science assistant specializing in food chemistry. 
Your job is to analyze each instruction in a cooking recipe and annotate it with chemical or physical cooking reactions. 
Use scientific terminology and be comprehensive in your analysis of all possible reactions.`;

    const userPrompt = `
Analyze the following recipe instructions and return a JSON list with scientific reactions for each step.
For each step include: 
1. "step" (the exact step text)
2. "reactions" (array of reaction types from the controlled vocabulary)
3. "reaction_details" (brief scientific explanation of what's happening)
4. "confidence" (number between 0-1 indicating your confidence in this analysis)

Controlled vocabulary for reaction types:
- maillard_reaction: Non-enzymatic browning between amino acids and reducing sugars
- caramelization: Sugar breakdown by high heat with no proteins involved
- gelatinization: Starch granules absorb water and swell with heat
- denaturation: Proteins unfold and lose native structure
- coagulation: Denatured proteins form solid networks
- emulsification: Suspension of fat in water or vice versa
- fermentation: Microbial conversion of carbs/proteins
- enzymatic_browning: Enzyme-driven oxidation causing browning
- pyrolysis: Dry, high-heat decomposition creating char
- smoking: Infusion of smoke particles into food
- crystallization: Formation of organized crystal structure
- rendering: Melting solid fat from animal tissue
- leavening_chemical: Gas production from chemical reactions
- leavening_biological: Gas production from microorganisms
- acidification: Lowering pH through acid addition
- brining: Salt penetration and osmosis effects
- gelation: Formation of gels via proteins or carbohydrates
- foaming: Trapping air in a protein/fat matrix
- expansion: Volume increase due to steam or gas
- retrogradation: Cooked starch realignment during cooling
- sous_vide_effects: Low-temperature controlled denaturation
- drying: Moisture removal affecting texture and preservation
- hydrolysis: Breaking chemical bonds with water
- neutralization: pH balancing reactions
- oxidation: Chemical reactions with oxygen
- reduction: Loss of oxygen or gain of electrons
- precipitation: Formation of solid in a solution

Return your analysis as a valid JSON array with one object per recipe step.
Format: [{step: "step text", reactions: ["reaction_type1", "reaction_type2"], reaction_details: "Scientific explanation", confidence: 0.95}, ...]

Input:
Title: ${title}
Instructions:
${instructions.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n")}
`;

    console.log("Sending request to OpenAI...");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const responseContent = response.choices[0].message.content || "{}";
    console.log(`Received response from OpenAI: ${responseContent.substring(0, 100)}...`);
    
    let parsed;
    try {
      parsed = JSON.parse(responseContent);
      // Convert to array format if the response came as an object with numeric keys
      if (!Array.isArray(parsed) && parsed.steps) {
        parsed = parsed.steps;
      } else if (!Array.isArray(parsed) && !parsed.steps) {
        // If we got a non-array without 'steps' key, manually extract
        parsed = Object.values(parsed).filter(value => typeof value === 'object');
      }
      
      if (!Array.isArray(parsed)) {
        throw new Error("Failed to parse response into array format");
      }
    } catch (err) {
      console.error("Failed to parse OpenAI response:", err);
      console.error("Raw response:", responseContent);
      
      return new Response(
        JSON.stringify({ error: "Failed to parse AI analysis response", raw: responseContent }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // First, delete any existing reactions for this recipe to avoid duplicates
    const { error: deleteError } = await supabase
      .from("recipe_step_reactions")
      .delete()
      .eq("recipe_id", recipe_id);
      
    if (deleteError) {
      console.error("Error deleting existing reactions:", deleteError);
      // Continue anyway - this might be the first time analyzing this recipe
    }

    // Map parsed analysis to database records and validate required fields
    const inserts = parsed.map((step: any, idx: number) => {
      // Ensure step_text is never null (critical fix)
      const stepText = typeof step.step === 'string' && step.step.trim().length > 0 
        ? step.step 
        : instructions[idx] || `Step ${idx + 1}`; // Fallback to original instruction or generic step name
      
      return {
        recipe_id,
        step_index: idx,
        step_text: stepText,
        reactions: Array.isArray(step.reactions) ? step.reactions : [],
        reaction_details: Array.isArray(step.reaction_details) 
          ? step.reaction_details 
          : [step.reaction_details || ""],
        confidence: typeof step.confidence === 'number' ? step.confidence : 0.8,
        ai_model: "gpt-4o",
        version: "1.0"
      };
    });

    console.log(`Inserting ${inserts.length} reaction records for recipe ${recipe_id}`);
    
    const { error: insertError } = await supabase
      .from("recipe_step_reactions")
      .insert(inserts);
      
    if (insertError) {
      console.error("Error inserting reaction analysis:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to store reaction analysis", details: insertError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Collect summarized scientific notes for the recipe
    const scienceNotes = parsed.flatMap((step: any) => {
      if (step.reaction_details && step.reactions && step.reactions.length > 0) {
        return [`${step.step || ''} — ${step.reaction_details} (${step.reactions.join(", ")})`];
      }
      return [];
    });

    // Update the recipe with the science notes
    if (scienceNotes.length > 0) {
      const { error: updateError } = await supabase
        .from("recipes")
        .update({
          science_notes: scienceNotes
        })
        .eq("id", recipe_id);

      if (updateError) {
        console.error("Error updating recipe science notes:", updateError);
        // Continue anyway - we still have the reaction data
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        inserted: inserts.length,
        notes: scienceNotes.length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-reactions function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
