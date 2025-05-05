
// This function validates and formats the AI response to extract structured changes
export function validateRecipeChanges(rawResponse: string) {
  console.log("Validating response length:", rawResponse.length);
  
  try {
    // With response_format: { type: "json_object" }, the response should be valid JSON
    const parsedResponse = JSON.parse(rawResponse);
    
    // Ensure that ingredients have a "mode" property and it's set to "none" if items array is empty or missing
    if (parsedResponse.changes && parsedResponse.changes.ingredients) {
      if (!Array.isArray(parsedResponse.changes.ingredients.items) || 
          parsedResponse.changes.ingredients.items.length === 0) {
        parsedResponse.changes.ingredients.mode = "none";
        parsedResponse.changes.ingredients.items = [];
      }
    } else if (parsedResponse.changes) {
      // Initialize ingredients with safe defaults if missing
      parsedResponse.changes.ingredients = { mode: "none", items: [] };
    }
    
    // Ensure science_notes is always a valid array
    if (parsedResponse.science_notes) {
      if (!Array.isArray(parsedResponse.science_notes)) {
        parsedResponse.science_notes = [];
      } else {
        // Filter out any non-string values
        parsedResponse.science_notes = parsedResponse.science_notes
          .filter(note => typeof note === 'string' && note.trim() !== '')
          .map(note => note.trim());
      }
    }
    
    // Standardize response format
    if (!parsedResponse.textResponse && parsedResponse.text_response) {
      parsedResponse.textResponse = parsedResponse.text_response;
    }

    if (!parsedResponse.textResponse) {
      parsedResponse.textResponse = "Analysis complete.";
    }
    
    return parsedResponse;
  } catch (error) {
    console.error("Error validating recipe changes:", error);
    // If JSON parsing fails, return a simple object with the raw text
    return {
      textResponse: rawResponse,
      changes: { mode: "none" }
    };
  }
}
