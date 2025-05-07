
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
    
    // Log the inputs (simplified)
    console.log("Starting quick recipe generation with main ingredient:", params.safeMain);
    console.log("Using model: gpt-4o-mini");
    
    console.log("Sending request to OpenAI API...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Updated to use gpt-4o-mini model
      response_format: { type: "json_object" },
      temperature: 0.4, // Reduced from 0.5 for more consistency
      max_tokens: 3000, // Reduced slightly while still allowing for comprehensive steps
      messages: [
        {
          role: "system",
          content: "You are Kenji López-Alt, renowned culinary scientist creating detailed, scientifically-grounded recipes. Return your response in JSON format following the user's specifications exactly."
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
    
    // Simplified logging
    console.log("OpenAI response received, length:", json.length);
    
    // Parse and validate the returned JSON
    let recipe;
    try {
      recipe = JSON.parse(json);
    } catch (parseError) {
      console.error("Error parsing OpenAI response as JSON:", parseError);
      throw new Error("Invalid JSON returned from OpenAI API");
    }
    
    // Simple validation
    if (!recipe.title || !recipe.ingredients || !Array.isArray(recipe.steps) || recipe.steps.length < 5) {
      console.error("Generated recipe is missing required fields");
      throw new Error("Generated recipe is missing required fields");
    }
    
    // Add backward compatibility fields
    recipe.instructions = recipe.steps;
    recipe.tagline = recipe.description;
    recipe.prep_time_min = recipe.prepTime;
    recipe.cook_time_min = recipe.cookTime;
    
    // Log token usage for cost monitoring
    if (response.usage) {
      console.log(`Token usage: ${response.usage.total_tokens} (prompt: ${response.usage.prompt_tokens}, completion: ${response.usage.completion_tokens})`);
    }
    
    return new Response(JSON.stringify(recipe), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (openaiError: any) {
    console.error("OpenAI API error:", openaiError);
    
    // Simplified error handling
    let errorMessage = "Error generating recipe from OpenAI";
    let errorDetails = openaiError.message || "Unknown OpenAI error";
    
    if (openaiError.message?.includes("401")) {
      errorMessage = "Invalid OpenAI API key";
    } else if (openaiError.message?.includes("429")) {
      errorMessage = "OpenAI rate limit exceeded";
    } else if (openaiError.message?.includes("500")) {
      errorMessage = "OpenAI internal server error";
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
