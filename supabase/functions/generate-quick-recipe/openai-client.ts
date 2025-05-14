
// Function to generate a recipe using OpenAI
export async function generateRecipeWithOpenAI(
  apiKey: string,
  prompt: string,
  params: any,
  corsHeaders: HeadersInit,
  debugInfo: string
): Promise<Response> {
  const startTime = Date.now();
  
  try {
    console.log("Sending request to OpenAI API...");
    
    // Configure the API request with a timeout
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 60000); // 60 second timeout
    
    // Make the request to OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Updated to use latest available model
        messages: [
          {
            role: "system",
            content: "You are a professional chef and recipe developer. Your task is to generate a complete recipe in JSON format following the user's instructions exactly. The recipe MUST contain a title, ingredients array (with qty_imperial, unit_imperial, qty_metric, unit_metric, item, and notes fields for each ingredient), and steps array."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
      signal: abortController.signal
    });
    
    // Clear the timeout since the request completed
    clearTimeout(timeoutId);
    
    const completionTime = Date.now() - startTime;
    console.log(`OpenAI API request completed in ${completionTime}ms with status: ${response.status}`);
    
    // Handle non-successful responses
    if (!response.ok) {
      let errorText;
      try {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
      } catch (e) {
        errorText = await response.text();
      }
      
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
      
      return new Response(
        JSON.stringify({
          error: "Recipe generation service error",
          details: `OpenAI API returned status ${response.status}: ${errorText}`,
          status: response.status,
          debug_info: debugInfo
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Parse the response
    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0 || !data.choices[0].message || !data.choices[0].message.content) {
      console.error("Unexpected OpenAI API response format:", data);
      return new Response(
        JSON.stringify({
          error: "Invalid response from recipe generation service",
          details: "The AI service returned an invalid response format",
          debug_info: debugInfo
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Extract the recipe JSON
    const recipeJsonRaw = data.choices[0].message.content;
    console.log("Raw recipe text:", recipeJsonRaw);
    console.log("OpenAI API returned recipe JSON (first 200 chars):", recipeJsonRaw.substring(0, 200));
    
    // Enhanced JSON parsing with error recovery
    let recipe;
    try {
      // First attempt: Direct parsing
      recipe = JSON.parse(recipeJsonRaw);
    } catch (parseError) {
      console.error("Error parsing recipe JSON:", parseError);
      
      // Second attempt: Fix common JSON issues
      try {
        // Try to fix unterminated strings by adding missing quotes
        const fixedJson = fixUnterminatedJson(recipeJsonRaw);
        recipe = JSON.parse(fixedJson);
        console.log("Successfully parsed recipe JSON after fixing unterminated strings");
      } catch (fixError) {
        console.error("Failed to fix unterminated JSON:", fixError);
        
        // Third attempt: Use a more lenient JSON parser or extraction strategy
        try {
          // Extract valid JSON object using regex - look for the outermost valid object
          const extractedJson = extractValidJsonObject(recipeJsonRaw);
          if (extractedJson) {
            recipe = JSON.parse(extractedJson);
            console.log("Successfully extracted and parsed valid JSON object");
          } else {
            throw new Error("Could not extract valid JSON");
          }
        } catch (extractError) {
          console.error("All JSON parsing attempts failed:", extractError);
          
          // Return a fallback recipe with error information
          return new Response(
            JSON.stringify({
              title: "Recipe Generation Failed",
              description: "Could not parse the generated recipe data",
              error_message: "Failed to parse recipe data from AI service",
              isError: true,
              ingredients: [],
              steps: ["The recipe generation system encountered an error. Please try again."]
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }
    
    // Validate the parsed recipe structure
    if (!recipe || typeof recipe !== 'object') {
      console.error("Invalid recipe object after parsing:", recipe);
      return new Response(
        JSON.stringify({
          title: "Recipe Structure Error",
          description: "The generated recipe has an invalid structure",
          error_message: "Recipe generated with invalid structure",
          isError: true,
          ingredients: [],
          steps: ["The recipe generation system encountered a structure error. Please try again."]
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Ensure recipe has required fields
    recipe = ensureCompleteRecipe(recipe, params);
    
    // Add metadata to the recipe
    recipe.generated_at = new Date().toISOString();
    recipe.generation_time_ms = completionTime;
    recipe.servings = params.servings || 2;
    
    // Return the recipe as JSON
    return new Response(
      JSON.stringify(recipe),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error: any) {
    const completionTime = Date.now() - startTime;
    console.error(`Error generating recipe with OpenAI after ${completionTime}ms:`, error);
    
    // Check if it's an abort error
    if (error.name === "AbortError") {
      return new Response(
        JSON.stringify({
          title: "Recipe Generation Timed Out",
          description: "The recipe generation request took too long and was aborted",
          error_message: "Recipe generation timed out",
          isError: true,
          ingredients: [],
          steps: ["The recipe generation process timed out. Please try again with simpler ingredients."]
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Handle general errors
    return new Response(
      JSON.stringify({
        title: "Recipe Generation Error",
        description: error.message || "An unexpected error occurred",
        error_message: error.message || String(error),
        isError: true,
        ingredients: [],
        steps: ["The recipe generation system encountered an error. Please try again."]
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

// Helper function to fix unterminated JSON strings
function fixUnterminatedJson(rawJson: string): string {
  // Look for unterminated strings (quotation marks without closing pairs)
  let inString = false;
  let escapeNext = false;
  let fixed = rawJson;
  
  // Check for missing trailing quotes at the end of property values
  fixed = fixed.replace(/:\s*"([^"\n]*)(?=\n|,|})/g, (match, p1) => {
    return ': "' + p1 + '"';
  });
  
  // Check for obvious unterminated strings at the end
  if (fixed.trim().endsWith('"')) {
    // If the JSON ends with a quotation mark that might be unopened
    let lastBraceIndex = fixed.lastIndexOf('}');
    if (lastBraceIndex > 0 && lastBraceIndex < fixed.length - 2) {
      // There's content after the last closing brace, which may be malformed
      fixed = fixed.substring(0, lastBraceIndex + 1);
    }
  }
  
  // Add missing closing brace if needed
  const openBraces = (fixed.match(/{/g) || []).length;
  const closeBraces = (fixed.match(/}/g) || []).length;
  
  if (openBraces > closeBraces) {
    fixed = fixed + "}".repeat(openBraces - closeBraces);
  }
  
  return fixed;
}

// Helper function to extract valid JSON object using regex
function extractValidJsonObject(text: string): string | null {
  // Look for a properly formed JSON object pattern
  // This regex matches the outermost JSON object, allowing for nested objects
  const objectRegex = /(\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\})/g;
  const matches = text.match(objectRegex);
  
  if (matches && matches.length > 0) {
    // Try each match until we find a valid JSON object
    for (const match of matches) {
      try {
        // Check if this is valid JSON
        JSON.parse(match);
        return match;
      } catch (e) {
        // Not valid, try the next one
        continue;
      }
    }
  }
  
  // More aggressive extraction - try to find any JSON-like structure
  const fallbackRegex = /\{[\s\S]*\}/g;
  const fallbackMatches = text.match(fallbackRegex);
  
  if (fallbackMatches && fallbackMatches.length > 0) {
    // Get the largest match (most likely to be the complete object)
    const largestMatch = fallbackMatches.reduce((prev, current) => 
      (prev.length > current.length) ? prev : current
    );
    
    return largestMatch;
  }
  
  return null;
}

// Helper function to ensure recipe has all required fields
function ensureCompleteRecipe(recipe: any, params: any): any {
  const completeRecipe = { ...recipe };
  
  // Ensure title exists
  if (!completeRecipe.title) {
    completeRecipe.title = params.mainIngredient 
      ? `${params.mainIngredient.charAt(0).toUpperCase() + params.mainIngredient.slice(1)} Recipe` 
      : "Recipe";
  }
  
  // Ensure ingredients is an array
  if (!completeRecipe.ingredients || !Array.isArray(completeRecipe.ingredients)) {
    completeRecipe.ingredients = [];
  }
  
  // Handle the case where we got a single ingredient instead of an array
  if (completeRecipe.item && completeRecipe.qty_imperial) {
    // We received a single ingredient object instead of a recipe
    completeRecipe.ingredients = [{
      item: completeRecipe.item,
      qty_imperial: completeRecipe.qty_imperial,
      unit_imperial: completeRecipe.unit_imperial || "",
      qty_metric: completeRecipe.qty_metric || completeRecipe.qty_imperial,
      unit_metric: completeRecipe.unit_metric || completeRecipe.unit_imperial || "",
      notes: completeRecipe.notes || ""
    }];
    
    // Add main ingredient if available
    if (params.mainIngredient && !completeRecipe.ingredients.some((ing: any) => 
      ing.item.toLowerCase().includes(params.mainIngredient.toLowerCase()))) {
      completeRecipe.ingredients.push({
        item: params.mainIngredient,
        qty_imperial: 1,
        unit_imperial: "serving",
        qty_metric: 1,
        unit_metric: "serving",
        notes: "Main ingredient"
      });
    }
  }
  
  // Ensure steps is an array
  if (!completeRecipe.steps || !Array.isArray(completeRecipe.steps)) {
    completeRecipe.steps = [];
  }
  
  // If we have ingredients but no steps, create some basic steps
  if (completeRecipe.ingredients.length > 0 && completeRecipe.steps.length === 0) {
    completeRecipe.steps = [
      "Prepare all ingredients according to the ingredient list.",
      "Combine ingredients and cook according to your preference.",
      "Serve and enjoy!"
    ];
  }
  
  // Ensure instructions exists (alias for steps)
  if (!completeRecipe.instructions || !Array.isArray(completeRecipe.instructions)) {
    completeRecipe.instructions = [...completeRecipe.steps];
  }
  
  // Ensure servings exists
  if (!completeRecipe.servings) {
    completeRecipe.servings = params.servings || 2;
  }
  
  // Ensure description exists
  if (!completeRecipe.description) {
    completeRecipe.description = `A delicious ${completeRecipe.title.toLowerCase()} recipe.`;
  }
  
  return completeRecipe;
}
