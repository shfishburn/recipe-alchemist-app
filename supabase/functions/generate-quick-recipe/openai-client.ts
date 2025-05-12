
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
            content: "You are a professional chef and recipe developer. Your task is to generate a complete recipe in JSON format following the user's instructions exactly."
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
    
    // Extract and parse the recipe JSON
    const recipeJson = data.choices[0].message.content;
    console.log("OpenAI API returned recipe JSON (first 200 chars):", recipeJson.substring(0, 200));
    
    let recipe;
    try {
      recipe = JSON.parse(recipeJson);
    } catch (err) {
      console.error("Error parsing recipe JSON:", err);
      console.log("Raw recipe text:", recipeJson);
      
      return new Response(
        JSON.stringify({
          error: "Invalid recipe format",
          details: "Could not parse the generated recipe as valid JSON",
          raw_recipe: recipeJson.substring(0, 500) + "...",
          debug_info: debugInfo
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
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
          error: "Recipe generation timed out",
          details: "The recipe generation request took too long and was aborted",
          debug_info: debugInfo
        }),
        { status: 504, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Handle general errors
    return new Response(
      JSON.stringify({
        error: "Recipe generation failed",
        details: error.message || String(error),
        debug_info: debugInfo
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}
