
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
    
    // Enhanced extraction - if all parsing fails, extract sections intelligently from the text
    console.log("Creating enhanced response object from raw text");
    return {
      textResponse: formatResponseForDisplay(rawResponse),
      changes: { mode: "none" },
      science_notes: extractSectionWithHeader(rawResponse, "Chemistry", "Science", "Ingredient") || extractScienceNotes(rawResponse),
      techniques: extractSectionWithHeader(rawResponse, "Technique", "Method", "Cooking") || extractTechniques(rawResponse),
      troubleshooting: extractSectionWithHeader(rawResponse, "Troubleshoot", "Problem", "Issue") || extractTroubleshooting(rawResponse)
    };
  }
}

// Format the response for better display in the UI
function formatResponseForDisplay(text: string): string {
  // Remove any markdown code blocks
  text = text.replace(/```[^`]*```/g, '');
  
  // Add paragraph breaks for better readability
  return text.split('\n\n').filter(p => p.trim().length > 0).join('<br><br>');
}

// Extract sections with headers from the text
function extractSectionWithHeader(text: string, ...headerKeywords: string[]): string[] | null {
  // Pattern to match section headers like "### Something" or "## Something"
  const headerRegex = new RegExp(`(#{1,3}\\s*(?:${headerKeywords.join('|')}).*?)(?:#{1,3}|$)`, 'gi');
  const sections: string[] = [];
  
  let matches;
  let lastIndex = 0;
  
  while ((matches = headerRegex.exec(text)) !== null) {
    const startIndex = matches.index;
    const headerText = matches[1];
    
    // If this is not the first match, extract the content of the previous section
    if (lastIndex > 0) {
      const sectionContent = text.substring(lastIndex, startIndex).trim();
      if (sectionContent) {
        sections.push(cleanUpSection(sectionContent));
      }
    }
    
    lastIndex = startIndex + headerText.length;
  }
  
  // Extract the last section if there was at least one match
  if (lastIndex > 0 && lastIndex < text.length) {
    const sectionContent = text.substring(lastIndex).trim();
    if (sectionContent) {
      sections.push(cleanUpSection(sectionContent));
    }
  }
  
  return sections.length > 0 ? sections : null;
}

// Clean up a section by removing markdown artifacts and splitting into paragraphs
function cleanUpSection(text: string): string {
  // Remove markdown headers
  text = text.replace(/^#{1,3}\s+.*$/gm, '');
  
  // Remove any code blocks
  text = text.replace(/```[^`]*```/g, '');
  
  // Remove bullet points and numbered lists
  text = text.replace(/^[\s-]*[-\d.]\s+/gm, '');
  
  // Join short lines and trim whitespace
  return text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join(' ')
    .trim();
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
