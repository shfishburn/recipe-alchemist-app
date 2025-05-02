
import OpenAI from "https://esm.sh/openai@4.0.0";

// OpenAI API interaction function
export async function generateRecipeWithOpenAI(
  apiKey: string,
  prompt: string,
  params: any,
  corsHeaders: Record<string, string>,
  debugInfo: string
): Promise<Response> {
  try {
    // Create OpenAI client
    const openai = new OpenAI({ apiKey });
    
    // Log the inputs and prompt for debugging
    console.log("Starting quick recipe generation with inputs:", { 
      cuisine: params.safeCuisine, 
      dietary: params.safeDiet, 
      mainIngredient: params.safeMain, 
      servings: params.safeServings, 
      maxCalories: params.maxCalories, 
      flavorTags: params.safeTags 
    });
    console.log("Using model: gpt-4o");
    
    console.log("Sending request to OpenAI API...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Keep using the more capable model
      response_format: { type: "json_object" },
      temperature: 0.5, // Reduced from 0.7 to make output more consistent
      max_tokens: 4000, // Increased to allow for more comprehensive steps
      messages: [
        {
          role: "system",
          content:
            "You are Kenji López-Alt, renowned culinary scientist creating detailed, scientifically-grounded recipes. YOUR PRIMARY STRENGTH is writing EXTREMELY THOROUGH, DETAILED recipe steps that explain the science behind each technique. Each step must include exact temperatures (both °F and °C), precise timing, and scientific explanations for why this method produces superior results. NEVER REDUCE THE NUMBER OF STEPS - separate distinct actions into individual steps. ABSOLUTELY REFUSE to produce simplified or vague instructions. MANDATORY: Include AT LEAST 10-15 necessary detailed steps. If you fail to provide the required level of scientific detail in EVERY step, your response will be rejected and regenerated.",
        },
        { role: "user", content: prompt },
      ],
    });
    
    console.log("OpenAI API response received");
    
    if (!response.choices || !response.choices[0]?.message?.content) {
      console.error("Invalid response from OpenAI:", response);
      throw new Error("Invalid response from OpenAI API");
    }
    
    const json = response.choices[0].message.content;
    console.log("OpenAI raw response length:", json.length);
    console.log("OpenAI raw response preview (first 300 chars):", json.substring(0, 300));
    
    // Validate the returned JSON
    let recipe;
    try {
      recipe = JSON.parse(json);
    } catch (parseError) {
      console.error("Error parsing OpenAI response as JSON:", parseError);
      throw new Error("Invalid JSON returned from OpenAI API");
    }
    
    // Simple validation
    if (!recipe.title || !recipe.ingredients || !Array.isArray(recipe.steps) || recipe.steps.length < 5) {
      console.error("Generated recipe is missing required fields:", recipe);
      throw new Error("Generated recipe is missing required fields");
    }
    
    // Normalize fields to ensure consistency between old and new formats
    recipe.instructions = recipe.steps; // Add instructions alias for Build compatibility
    recipe.tagline = recipe.description; // Add tagline alias for Build compatibility
    recipe.prep_time_min = recipe.prepTime; // Ensure both time formats exist
    recipe.cook_time_min = recipe.cookTime; // Ensure both time formats exist
    
    // Log number of tokens used for debugging
    if (response.usage) {
      console.log("Token usage:", {
        prompt_tokens: response.usage.prompt_tokens,
        completion_tokens: response.usage.completion_tokens,
        total_tokens: response.usage.total_tokens
      });
    }
    
    return new Response(JSON.stringify(recipe), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (openaiError) {
    console.error("OpenAI API error:", openaiError);
    // Improved error response with more details
    let errorMessage = "Error generating recipe from OpenAI";
    let errorDetails = openaiError.message || "Unknown OpenAI error";
    
    // Check for common OpenAI error patterns
    if (errorDetails.includes("401")) {
      errorMessage = "Invalid OpenAI API key";
      errorDetails = "The API key provided was rejected by OpenAI. Please check the key and try again.";
    } else if (errorDetails.includes("429")) {
      errorMessage = "OpenAI rate limit exceeded";
      errorDetails = "The OpenAI API rate limit has been exceeded. Please try again later.";
    } else if (errorDetails.includes("500")) {
      errorMessage = "OpenAI internal server error";
      errorDetails = "OpenAI is experiencing internal issues. Please try again later.";
    } else if (errorDetails.includes("400")) {
      errorMessage = "Invalid request format";
      errorDetails = "The request to OpenAI was invalid. This could be due to an issue with the prompt or parameters.";
    }
    
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: errorDetails,
        debugInfo: debugInfo
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
}
