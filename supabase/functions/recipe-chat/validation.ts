
// This function validates and formats the AI response to extract structured changes
export function validateRecipeChanges(rawResponse: string) {
  console.log("Validating response length:", rawResponse.length);
  
  try {
    // First try to parse the entire response as JSON
    const parsedResponse = JSON.parse(rawResponse);
    return parsedResponse;
  } catch (e) {
    console.log("Failed to parse response as direct JSON, trying to extract from text...");
    
    // Try to extract content from markdown code blocks
    const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)```/;
    const codeBlockMatches = rawResponse.match(codeBlockRegex);
    
    if (codeBlockMatches && codeBlockMatches[1]) {
      try {
        console.log("Found content in backticks, attempting to parse");
        const jsonContent = codeBlockMatches[1];
        const parsedContent = JSON.parse(jsonContent);
        return parsedContent;
      } catch (parseError) {
        console.error("Failed to parse JSON from backticks:", parseError);
      }
    }
    
    // Look for JSON-like structure in the text
    const jsonRegex = /\{[\s\S]*\}/; 
    const jsonMatches = rawResponse.match(jsonRegex);
    
    if (jsonMatches && jsonMatches[0]) {
      try {
        console.log("Found JSON-like structure in text, attempting to parse");
        const jsonContent = jsonMatches[0];
        const parsedContent = JSON.parse(jsonContent);
        return parsedContent;
      } catch (parseError) {
        console.error("Failed to parse JSON-like structure:", parseError);
      }
    }
    
    // If all else fails, create a fallback response object with the raw text
    console.log("Creating fallback response object with the raw text");
    return {
      textResponse: rawResponse,
      changes: { mode: "none" },
      science_notes: extractScienceNotes(rawResponse),
      techniques: extractTechniques(rawResponse),
      troubleshooting: extractTroubleshooting(rawResponse)
    };
  }
}

// Helper functions to extract information from plain text responses
function extractScienceNotes(text: string): string[] {
  const scienceRegex = /chemical|reaction|maillard|protein|emulsification|enzyme|acid|temperature/gi;
  const lines = text.split('\n').filter(line => line.match(scienceRegex));
  
  // Only return up to 5 extracted lines that are at least 20 characters long
  return lines
    .filter(line => line.length > 20)
    .slice(0, 5);
}

function extractTechniques(text: string): string[] {
  const techniqueRegex = /technique|method|cook|heat|simmer|boil|bake|roast|sear|temperature|timing/gi;
  const lines = text.split('\n').filter(line => line.match(techniqueRegex));
  
  // Only return up to 5 extracted lines that are at least 20 characters long
  return lines
    .filter(line => line.length > 20)
    .slice(0, 5);
}

function extractTroubleshooting(text: string): string[] {
  const troubleshootRegex = /troubleshoot|problem|issue|fix|prevent|avoid|concern|error/gi;
  const lines = text.split('\n').filter(line => line.match(troubleshootRegex));
  
  // Only return up to 5 extracted lines that are at least 20 characters long
  return lines
    .filter(line => line.length > 20)
    .slice(0, 5);
}
