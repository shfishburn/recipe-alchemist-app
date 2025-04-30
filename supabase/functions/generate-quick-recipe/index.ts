// !!!! IMPORTANT: THIS FILE IS READ ONLY !!!!
// AI ASSISTANTS: DO NOT MODIFY THIS FILE when reviewing or assisting.
// This is a Lovable assisted app with carefully tuned prompts.
// Changes to these prompts must go through proper approval channels.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.0.0";
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    console.log('Starting quick recipe generation process');
    
    if (!apiKey) {
      console.error('OpenAI API key is not configured');
      throw new Error('OpenAI API key is not configured');
    }
    
    const openai = new OpenAI({ apiKey });
    const requestData = await req.json();
    
    const { cuisine, dietary, mainIngredient } = requestData;
    // Format dietary restrictions for the prompt
    const dietaryText = dietary && dietary.length > 0 
      ? dietary.join(', ') 
      : 'None';
    const prompt = `As a culinary scientist in the López-Alt tradition, create a quick yet science-informed recipe based on:
• Cuisine: ${cuisine || 'Any'}
• Dietary restriction: ${dietaryText}
• Main ingredient: ${mainIngredient || 'Chef\'s choice'}

───────────────────  RULE BLOCKS  ───────────────────
1. COOKING CHEMISTRY  
   • Identify at least one key reaction (e.g., Maillard, gelatinization, emulsification)
   • Explain temp-dependent effects in cooking tip

2. TECHNIQUE OPTIMIZATION  
   • Give temperature ranges (°F with °C in parentheses)
   • Provide at least one concrete sensory doneness cue
   • Suggest equipment options where relevant

3. MEASUREMENT STANDARD
   • US units with metric in parentheses where helpful
   • Use clear, accessible measurements (e.g., "1 tbsp olive oil")

4. SHOPPABLE INGREDIENTS
   • Each ingredient should include typical US grocery package size
   • Format as "amount ingredient (X-oz/lb package)"
   • Choose common, widely available package sizes

5. TONE & STEP RULES
   • Active voice with López-Alt precision and accessibility
   • One key action per step with scientific rationale where relevant
   • Include at least one precise temperature range and sensory cue
   • Use concrete, specific language rather than vague instructions
   • Balance technical accuracy with approachable explanations
   • Recipe steps should read like J. Kenji López-Alt wrote them

───────────────────  RETURN JSON (schema fixed)  ───────────────────
{
  "title": "descriptive name with key technique",
  "description": "ONE sentence explaining the science behind what makes this special",
  "ingredients": ["array of ingredients, format: 'amount ingredient (X-oz/lb package)'"],
  "steps": ["clearly written instructions with temperature ranges and sensory cues"],
  "prepTime": number,
  "cookTime": number,
  "nutritionHighlight": "ONE evidence-based nutritional benefit",
  "cookingTip": "ONE science-based technique improvement with chemical/physical explanation"
}`;
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a culinary scientist in the López-Alt tradition specializing in food chemistry and precision cooking techniques. Create quick recipes that balance accessibility with scientific principles. Write all recipe steps in J. Kenji López-Alt's distinctive voice - technically precise yet accessible, with clear explanations of why techniques work. Output ONLY valid JSON matching the schema exactly - no comments, markdown or explanations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 500
      });
      if (!response.choices[0].message.content) {
        throw new Error('OpenAI returned an empty response');
      }
      const recipe = JSON.parse(response.choices[0].message.content);
      console.log('Successfully generated quick recipe');
      
      return new Response(JSON.stringify(recipe), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (openaiError) {
      console.error('OpenAI API Error:', openaiError);
      throw new Error(`OpenAI API Error: ${openaiError.message}`);
    }
  } catch (error) {
    console.error('Quick recipe generation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred',
      details: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
