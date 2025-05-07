
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Inline recipe analysis prompt - focused and optimized for scientific analysis
const recipeAnalysisPrompt = `You are a culinary scientist specializing in food chemistry and cooking techniques in the López-Alt tradition. Analyze this recipe scientifically and provide:

1. CHEMISTRY: Key chemical reactions, temperature-dependent processes, and flavor development mechanisms
2. TECHNIQUES: Optimal temperature ranges (°F and °C), timing, and doneness indicators
3. INGREDIENT SCIENCE: Functional roles and substitution impacts
4. TROUBLESHOOTING: Science-based solutions for common issues

Return response as JSON:
{
  "textResponse": "Detailed analysis text",
  "science_notes": ["Key scientific points"],
  "techniques": ["Technical details"],
  "troubleshooting": ["Problem solutions"]
}`;

// Function to extract science notes from text if none were properly structured
function extractScienceNotesFromText(text: string): string[] {
  const scienceKeywords = ['chemistry', 'maillard', 'protein', 'reaction', 'temperature', 'starch'];
  const paragraphs = text.split(/\n\n+/);
  const scienceNotes: string[] = [];
  
  // Look for paragraphs containing science keywords
  paragraphs.forEach(paragraph => {
    const lowerParagraph = paragraph.toLowerCase();
    
    for (const keyword of scienceKeywords) {
      if (lowerParagraph.includes(keyword) && paragraph.length > 30) {
        // Clean up the paragraph
        const cleaned = paragraph
          .replace(/^#+\s+/, '') // Remove markdown headers
          .replace(/^\d+\.\s+/, '') // Remove numbered list markers
          .replace(/^\*\s+/, '') // Remove bullet points
          .trim();
        
        if (cleaned.length > 0) {
          scienceNotes.push(cleaned);
          break; // Break after finding first keyword match in paragraph
        }
      }
    }
  });
  
  // If we still don't have any science notes, look for sentences
  if (scienceNotes.length === 0) {
    const sentences = text.split(/[.!?]+\s+/);
    
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      for (const keyword of scienceKeywords) {
        if (lowerSentence.includes(keyword) && sentence.length > 20) {
          scienceNotes.push(sentence.trim());
          break;
        }
      }
      
      // Limit to 3 extracted notes
      if (scienceNotes.length >= 3) break;
    }
  }
  
  return scienceNotes.slice(0, 5); // Return at most 5 notes
}

// Function to validate and process the AI response
function validateRecipeChanges(rawResponse: any) {
  try {
    // Now that we're using response_format: { type: "json_object" },
    // the response should be a JSON object directly
    const jsonResponse = typeof rawResponse === 'string' 
      ? JSON.parse(rawResponse) 
      : rawResponse;
    
    // Safety checks for required fields
    if (!jsonResponse.textResponse && !jsonResponse.text_response) {
      jsonResponse.textResponse = rawResponse;
    }
    
    // Standardize science_notes format
    if (jsonResponse.science_notes) {
      if (!Array.isArray(jsonResponse.science_notes)) {
        jsonResponse.science_notes = [];
      } else {
        // Filter out any non-string values
        jsonResponse.science_notes = jsonResponse.science_notes
          .filter((note: any) => typeof note === 'string' && note.trim() !== '')
          .map((note: string) => note.trim());
      }
    }
    
    return jsonResponse;
  } catch (error) {
    console.error("Error validating recipe changes:", error);
    // Fallback to wrapping the raw response as text
    return {
      textResponse: rawResponse,
      science_notes: []
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { recipe } = requestData;
    
    // Validate required parameters
    if (!recipe) {
      console.error("Missing recipe data in request");
      throw new Error("Recipe data is required");
    }
    
    console.log(`Processing scientific analysis for recipe ${recipe.id || 'new'}`);
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const prompt = `
    Current recipe:
    ${JSON.stringify(recipe)}

    Please provide a detailed scientific analysis of the above recipe, focusing on the chemistry of cooking, technique optimization, and troubleshooting guidance. Include specific temperature thresholds, reactions, and scientific explanations.
    `;

    console.log(`Sending request to OpenAI with ${prompt.length} characters`);

    try {
      const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Using the faster model
          messages: [
            {
              role: 'system',
              content: recipeAnalysisPrompt,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          response_format: { type: "json_object" }, // Enforce JSON output format
          max_tokens: 1500, // Reduced from 2500 for faster responses
        }),
      }).then((res) => res.json());
      
      if (!aiResponse.choices || !aiResponse.choices[0] || !aiResponse.choices[0].message) {
        console.error("Invalid AI response structure:", aiResponse);
        throw new Error("Failed to get a valid response from OpenAI");
      }
      
      const rawResponse = aiResponse.choices[0].message.content;
      console.log("Raw AI response:", rawResponse.substring(0, 200) + "...");

      // Process the response with our validation function
      const processedResponse = validateRecipeChanges(rawResponse);
      
      // Prepare the response data format
      let textResponse = processedResponse.textResponse || processedResponse.text_response || rawResponse;
      let scienceNotes = processedResponse.science_notes || [];
      let techniques = processedResponse.techniques || [];
      let troubleshooting = processedResponse.troubleshooting || [];
      
      // Ensure we have at least some science notes
      if (!Array.isArray(scienceNotes) || scienceNotes.length === 0) {
        // Extract potential science notes from the text response
        scienceNotes = extractScienceNotesFromText(textResponse);
      }
      
      const responseData = { 
        success: true, 
        science_notes: scienceNotes,
        techniques: techniques,
        troubleshooting: troubleshooting,
        textResponse: textResponse,
      };

      return new Response(
        JSON.stringify(responseData),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (aiError: any) {
      console.error("Error with OpenAI request:", aiError);
      throw new Error(`OpenAI request failed: ${aiError.message}`);
    }
  } catch (error: any) {
    console.error("Error in analyze-recipe-science function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
