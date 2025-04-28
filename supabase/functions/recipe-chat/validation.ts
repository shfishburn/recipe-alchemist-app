
export const validateRecipeChanges = (response: string): any => {
  try {
    // First try to parse the raw JSON directly
    try {
      return JSON.parse(response);
    } catch (e) {
      console.log("Failed to parse response as direct JSON, trying to clean markdown...");

      // If direct parsing fails, try to extract JSON from markdown code blocks
      const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        console.log("Found JSON in markdown code block, attempting to parse");
        return JSON.parse(jsonMatch[1]);
      }

      // If that fails, see if the whole response is wrapped in backticks
      const backtickMatch = response.match(/`([\s\S]*)`/);
      if (backtickMatch && backtickMatch[1]) {
        console.log("Found content in backticks, attempting to parse");
        return JSON.parse(backtickMatch[1]);
      }

      // As a last resort, try to create a basic structure from the text response
      console.log("Creating fallback response object");
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
