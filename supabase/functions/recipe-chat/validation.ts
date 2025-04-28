
export const validateRecipeChanges = (response: string): any => {
  try {
    // First try to parse the raw JSON directly
    try {
      const parsedJson = JSON.parse(response);
      console.log("Successfully parsed direct JSON response");
      return parsedJson;
    } catch (e) {
      console.log("Failed to parse response as direct JSON, trying to extract from text...");

      // Try to extract JSON from markdown code blocks
      const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        console.log("Found JSON in markdown code block, attempting to parse");
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (innerError) {
          console.error("Failed to parse JSON from code block:", innerError);
        }
      }

      // Check if the whole response is wrapped in backticks
      const backtickMatch = response.match(/`([\s\S]*)`/);
      if (backtickMatch && backtickMatch[1]) {
        console.log("Found content in backticks, attempting to parse");
        try {
          return JSON.parse(backtickMatch[1]);
        } catch (innerError) {
          console.error("Failed to parse JSON from backticks:", innerError);
        }
      }
      
      // Look for JSON-like structure within the text
      const jsonLikeMatch = response.match(/{[\s\S]*}/);
      if (jsonLikeMatch) {
        console.log("Found JSON-like structure in text, attempting to parse");
        try {
          return JSON.parse(jsonLikeMatch[0]);
        } catch (innerError) {
          console.error("Failed to parse JSON-like structure:", innerError);
        }
      }

      // As a last resort, create a basic structure from the text response
      console.log("Creating fallback response object with the raw text");
      return {
        textResponse: response,
        changes: { mode: "none" }
      };
    }
  } catch (error) {
    console.error("Error validating recipe changes:", error);
    return {
      textResponse: response,
      changes: { mode: "none" }
    };
  }
};
