
/**
 * Attempts to parse a response string into a structured JSON object
 * Handles both direct JSON and embedded JSON in markdown blocks
 */
export function parseResponseJson(response: string): any {
  if (!response) return null;
  
  try {
    // First, try parsing as JSON
    try {
      // Check if the response is already in JSON format
      if (response.trim().startsWith('{') && response.trim().endsWith('}')) {
        return JSON.parse(response);
      }
    } catch (e) {
      // Not valid JSON, continue with other methods
    }
    
    // Try extracting JSON from markdown code blocks
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (jsonError) {
        console.warn("Error parsing JSON from code block:", jsonError);
      }
    }
    
    // If all parsing attempts fail, return null
    return null;
  } catch (error) {
    console.error("Error parsing JSON response:", error);
    return null;
  }
}

/**
 * Extracts plain text content from a potentially JSON-formatted response
 */
export function extractTextContent(response: string): string {
  if (!response) return '';
  
  try {
    // Try parsing as JSON
    const parsedResponse = parseResponseJson(response);
    
    // Extract the text content if it exists in expected fields
    if (parsedResponse) {
      return parsedResponse.textResponse || parsedResponse.response || response;
    }
    
    // Clean up the response by removing any remaining JSON syntax markers
    return response
      .replace(/^\s*{/g, '')
      .replace(/}\s*$/g, '')
      .replace(/"textResponse":/g, '')
      .replace(/"response":/g, '')
      .replace(/^["']|["']$/g, '')
      .trim();
      
  } catch (e) {
    // If parsing fails, return the original response
    return response;
  }
}
