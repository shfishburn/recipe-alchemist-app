
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
    let systemPrompt = `As a culinary scientist and registered dietitian in the López-Alt tradition, analyze and improve this recipe with precise, science-backed techniques. Please format your response as JSON with these fields:

1. textResponse - Your main analysis including:
   - Key chemical processes occurring (Maillard reactions, protein denaturation, etc)
   - Temperature-dependent techniques analysis
   - Scientific rationale for ingredient choices

2. science_notes - An array of strings with key scientific principles

3. troubleshooting - An array of strings with common issues and fixes

4. changes - An object containing suggested recipe improvements

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
          "How would the science behind this recipe change if we altered the cooking temperature?",
          "What specific chemical reactions occur when cooking this dish?",
          "How could we modify this recipe for different dietary restrictions while maintaining the same flavor profile?"
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
