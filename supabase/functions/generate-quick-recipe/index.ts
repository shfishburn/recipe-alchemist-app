
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Define timeout duration in milliseconds (2 minutes)
const TIMEOUT_DURATION = 120000;

serve(async (req) => {
  // Handle CORS for browser requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Parse request body
    const requestData = await req.json();
    console.log("Received request data:", JSON.stringify(requestData));
    
    // Store user id if available for authentication
    const userId = requestData.user_id;
    
    // For resuming after auth - store metadata
    const authContext = {
      resumable: true,
      formData: requestData,
      timestamp: Date.now()
    };

    // Check if OpenAI API key is available
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error("Missing OPENAI_API_KEY environment variable");
      return new Response(
        JSON.stringify({
          error: "Configuration error: OpenAI API key is missing",
          isError: true,
          status: 500,
          auth_context: authContext
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 500
        }
      );
    }
    
    // Generate response with timeout logic
    const responseData = await generateWithTimeout(requestData);
    
    // Return the generated recipe
    return new Response(
      JSON.stringify({
        ...responseData,
        auth_context: authContext
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200
      }
    );
  } catch (error) {
    // Handle errors with more detailed logging
    console.error("Error in edge function:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = errorMessage.includes('timeout') ? 408 : 500;
    
    return new Response(
      JSON.stringify({
        error: errorMessage,
        isError: true,
        status: statusCode,
        details: "An error occurred while generating the recipe. Please try again."
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: statusCode
      }
    );
  }
});

// Helper function to generate recipe with timeout protection
async function generateWithTimeout(requestData) {
  const { ingredients, max_calories, allowed_time } = requestData;

  // Validate input data
  if (!ingredients || !Array.isArray(ingredients) && typeof ingredients !== 'string') {
    console.error("Invalid ingredients format:", ingredients);
    throw new Error('Invalid ingredients format. Please provide ingredients as an array or string.');
  }

  // Convert ingredients to array if it's a string
  const ingredientsArray = typeof ingredients === 'string' 
    ? [ingredients] 
    : ingredients;

  // Construct the prompt
  let prompt = `Generate a quick recipe based on the following ingredients: ${ingredientsArray.join(', ')}.`;
  if (max_calories) {
    prompt += ` The recipe should have no more than ${max_calories} calories.`;
  }
  prompt += " Provide the recipe title, a list of ingredients with quantities, and numbered steps to prepare the dish.";

  // Set up the request to OpenAI
  const openaiUrl = 'https://api.openai.com/v1/chat/completions';
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

  if (!openaiApiKey) {
    throw new Error('OpenAI API key is missing.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log('Timeout occurred');
    controller.abort();
  }, allowed_time || TIMEOUT_DURATION);

  try {
    console.log("Sending request to OpenAI with prompt:", prompt.substring(0, 100) + "...");
    
    const openaiResponse = await fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
        n: 1,
        stop: null,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!openaiResponse.ok) {
      console.error('OpenAI API error:', openaiResponse.status, openaiResponse.statusText);
      let errorDetails;
      try {
        errorDetails = await openaiResponse.text();
      } catch (e) {
        errorDetails = "Could not read error details";
      }
      throw new Error(`OpenAI API request failed with status ${openaiResponse.status}: ${errorDetails}`);
    }

    const openaiData = await openaiResponse.json();
    console.log("Received OpenAI response:", JSON.stringify(openaiData).substring(0, 100) + "...");

    if (!openaiData.choices || openaiData.choices.length === 0) {
      throw new Error('No recipe generated by OpenAI.');
    }

    const recipeText = openaiData.choices[0].message.content.trim();

    // Parse the generated recipe text
    const recipe = parseRecipe(recipeText);
    
    // Return the generated recipe
    return recipe;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Error generating recipe:', error);
    throw error;
  }
}

function parseRecipe(recipeText) {
    console.log("Parsing recipe text:", recipeText.substring(0, 100) + "...");
    
    const recipe = {
        title: '',
        ingredients: [],
        steps: []
    };

    const lines = recipeText.split('\n').map(line => line.trim()).filter(line => line !== '');

    let i = 0;
    let currentSection = null;

    // Extract title - usually the first line
    if (i < lines.length) {
        recipe.title = lines[i].replace(/^#*\s*/, ''); // Remove any markdown heading symbols
        i++;
    }

    // Process the rest of the lines
    while (i < lines.length) {
        const line = lines[i];
        
        // Check for section headers
        if (line.toLowerCase().includes('ingredients') || line.match(/^ingredients:?$/i)) {
            currentSection = 'ingredients';
            i++;
            continue;
        } else if (line.toLowerCase().includes('instructions') || line.toLowerCase().includes('directions') || 
                  line.toLowerCase().includes('steps') || line.match(/^steps:?$/i)) {
            currentSection = 'steps';
            i++;
            continue;
        }
        
        // Process content based on current section
        if (currentSection === 'ingredients') {
            // Strip out bullets, numbers, etc.
            const cleanedLine = line.replace(/^[-*•]|\d+\.\s+/, '').trim();
            if (cleanedLine) {
                recipe.ingredients.push(cleanedLine);
            }
        } else if (currentSection === 'steps') {
            // Strip out numbers if present, but not from the content
            const cleanedLine = line.replace(/^\d+[.)\]]?\s+/, '').trim();
            if (cleanedLine) {
                recipe.steps.push(cleanedLine);
            }
        } else if (!currentSection && line.match(/^[-*•]|\d+\.\s+/)) {
            // If we haven't identified a section but line starts with a bullet or number,
            // assume it's an ingredient
            const cleanedLine = line.replace(/^[-*•]|\d+\.\s+/, '').trim();
            recipe.ingredients.push(cleanedLine);
        }
        
        i++;
    }

    // If the steps array is empty but we have content that might be steps,
    // try to extract steps more aggressively
    if (recipe.steps.length === 0) {
        // Look for numbered items after ingredients
        let foundIngredients = false;
        for (const line of lines) {
            if (line.toLowerCase().includes('ingredients')) {
                foundIngredients = true;
                continue;
            }
            
            if (foundIngredients && line.match(/^\d+\.\s+/)) {
                const step = line.replace(/^\d+\.\s+/, '').trim();
                if (step && !recipe.steps.includes(step)) {
                    recipe.steps.push(step);
                }
            }
        }
    }

    // Final fallback: if we still have no steps, take any remaining lines after ingredients
    if (recipe.steps.length === 0 && recipe.ingredients.length > 0) {
        let ingredientsSection = false;
        for (const line of lines) {
            if (line.toLowerCase().includes('ingredients')) {
                ingredientsSection = true;
                continue;
            }
            
            if (ingredientsSection && !recipe.ingredients.includes(line) && 
                !line.toLowerCase().includes('ingredients') && line !== recipe.title) {
                recipe.steps.push(line);
            }
        }
    }

    console.log("Parsed recipe:", {
        title: recipe.title,
        ingredientsCount: recipe.ingredients.length,
        stepsCount: recipe.steps.length
    });
    
    return recipe;
}
