
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

    // Create the base prompt - this ensures that regardless of what the client sends,
    // we format a system message that requests JSON output
    let systemPrompt = `As a culinary scientist and registered dietitian in the López-Alt tradition, analyze and improve this recipe with precise, science-backed techniques. 

When analyzing recipes, pay special attention to:
1. Cooking method authenticity - ensure that traditional dishes use the correct cooking methods (slow-cooking, braising, etc.) regardless of time requirements
2. Appropriate cooking times - do not compress cooking times for dishes that traditionally require long cooking periods
3. Correct equipment selection - verify that the recipe specifies the right equipment (slow cooker, dutch oven, etc.) for the dish
4. Active vs. passive cooking time - distinguish between hands-on preparation time and inactive cooking time
5. Temperature precision - ensure cooking temperatures are appropriate for the specific cooking method

Please format your response as JSON with these fields:

1. textResponse - Your main analysis including:
   - Key chemical processes occurring (Maillard reactions, protein denaturation, etc)
   - Temperature-dependent techniques analysis
   - Scientific rationale for ingredient choices
   - Validation of cooking method and time against traditional standards

2. science_notes - An array of strings with key scientific principles

3. troubleshooting - An array of strings with common issues and fixes

4. changes - An object containing suggested recipe improvements, including corrected cooking methods and times if needed

5. followUpQuestions - An array of strings with follow-up question suggestions

Remember that I need your response formatted as JSON compatible with these fields.`;

    // Append user message for context if provided
    if (userMessage) {
      systemPrompt += `\n\nUser request: ${userMessage}`;
    }

    console.log("Sending request to OpenAI with JSON format prompt");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze this ${recipe.cuisine || 'standard'} recipe for ${recipe.title} in JSON format.` }
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
        troubleshooting: parsedContent.troubleshooting || [],
        followUpQuestions: parsedContent.followUpQuestions || [
          "How would the science behind this recipe change if we altered the cooking method?",
          "What specific chemical reactions occur during the extended cooking time?",
          "How could we modify this recipe for different dietary restrictions while maintaining the authentic cooking method?",
          "What is the scientific reason for using this specific cooking technique/time in traditional recipes?"
        ]
      };
      
      console.log("Returning structured response with science notes:", 
                 responseWithFollowUp.science_notes?.length || 0, 
                 "and troubleshooting tips:", 
                 responseWithFollowUp.troubleshooting?.length || 0);
      
      return new Response(JSON.stringify(responseWithFollowUp), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } catch (e) {
      console.error("Error parsing AI response:", e);
      console.error("Raw response content:", content);
      
      // Fallback: If parsing fails, try to create a basic structure from the text
      try {
        // Format as basic output
        const fallbackResponse = {
          textResponse: content,
          science_notes: ["Our AI couldn't format a proper analysis. Here's what it returned:", content.substring(0, 200) + "..."],
          troubleshooting: ["Please try analyzing again."],
          changes: null,
          followUpQuestions: ["Can you explain this recipe in simpler terms?"]
        };
        
        return new Response(JSON.stringify(fallbackResponse), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (fallbackError) {
        return new Response(JSON.stringify({ 
          error: "Failed to generate proper recipe suggestions. Please try again.",
          details: e.message,
          rawResponse: content.substring(0, 500) // Limit length for security
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
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
