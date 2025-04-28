import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const openai = new OpenAI({ apiKey });
    const { recipe, userMessage, sourceType, sourceUrl, sourceImage } = await req.json();

    let prompt = `As a culinary scientist and registered dietitian in the López-Alt tradition, analyze and improve this recipe with precise, science-backed techniques. Your response should:

1. Examine Chemical Processes:
   - Explain Maillard reactions, caramelization, and enzymatic activities occurring
   - Detail how heat transfer methods affect flavor compound development
   - Describe protein denaturation and starch gelatinization specific to these ingredients
   - Identify key flavor molecules and their interactions during cooking

2. Enhance Techniques with Scientific Precision:
   - Specify exact temperatures, timing, and visual/tactile doneness cues
   - Explain how ingredient preparation affects texture and flavor
   - Provide equipment recommendations based on thermal properties
   - Include troubleshooting for common issues with scientific explanations

3. MEASUREMENT STANDARDIZATION:
   - All measurements MUST be in imperial units (oz, lb, cups, tbsp, tsp, inches, °F)
   - Convert any metric values to their imperial equivalents
   - For small quantities where precision matters, use fractions (1/4 tsp, etc.)
   - Provide temperatures in °F with °C in parentheses where relevant

4. INLINE INGREDIENTS FORMAT:
   - Include ingredient references within instructions using **bold** text
   - Each instruction must reference specific ingredients with exact quantities
   - Example: "Heat a large skillet and add **2 tablespoons olive oil**. Once hot, sear **1 pound beef chuck, cubed** until browned"
   - Maintain complete measurements in the separate ingredients list with quality specs
   - Ensure every ingredient mentioned is properly formatted in bold

5. Transform Ingredient Understanding:
   - Explain chemical composition of key ingredients and their functional roles
   - Detail how ingredient quality indicators affect results
   - Provide scientifically-validated substitutions with reasoning
   - Explain how ingredient temperature, pH, and freshness impact outcomes`;

    console.log("Sending request to OpenAI with prompt");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    console.log("Received response from OpenAI:", content.substring(0, 100) + "...");
    
    try {
      // Ensure we can parse the JSON response
      const parsedContent = JSON.parse(content);
      console.log("Successfully parsed JSON response");
      
      // Create a structured response object - include followUpQuestions in the main response
      const responseWithFollowUp = {
        textResponse: parsedContent.textResponse || content,
        changes: parsedContent.changes || null,
        nutrition: parsedContent.nutrition || {},
        health_insights: parsedContent.health_insights || [],
        equipmentNeeded: parsedContent.changes?.equipmentNeeded || [],
        science_notes: parsedContent.science_notes || [],
        followUpQuestions: parsedContent.followUpQuestions || [
          "How would the science behind this recipe change if we altered the cooking temperature?",
          "What specific chemical reactions occur when cooking this dish?",
          "How could we modify this recipe for different dietary restrictions while maintaining the same flavor profile?"
        ]
      };
      
      // Convert the entire response to a string for storage
      const suggestion = {
        response: JSON.stringify(responseWithFollowUp),
        changes: {
          title: parsedContent.changes?.title || null,
          ingredients: parsedContent.changes?.ingredients || null,
          instructions: parsedContent.changes?.instructions || null,
          nutrition: parsedContent.nutrition || {},
          health_insights: parsedContent.health_insights || [],
          equipmentNeeded: parsedContent.changes?.equipmentNeeded || [],
          science_notes: parsedContent.science_notes || []
        }
      };
      
      console.log("Returning structured response to client");
      return new Response(JSON.stringify(suggestion), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } catch (e) {
      console.error("Error parsing AI response:", e);
      console.error("Raw response content:", content);
      
      return new Response(JSON.stringify({ 
        error: "Failed to generate proper recipe suggestions. Please try again.",
        details: e.message,
        rawResponse: content
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Recipe chat error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
