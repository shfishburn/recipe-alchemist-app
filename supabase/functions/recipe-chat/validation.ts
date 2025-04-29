
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
    
    // Enhanced extraction - extract sections intelligently from the text
    console.log("Creating enhanced response object from raw text");
    return {
      textResponse: formatResponseForDisplay(rawResponse),
      changes: { mode: "none" },
      science_notes: extractSectionContent(rawResponse, "Chemistry", "Science", "Chemical", "Maillard"),
      techniques: extractSectionContent(rawResponse, "Technique", "Method", "Cooking", "Temperature"),
      troubleshooting: extractSectionContent(rawResponse, "Troubleshoot", "Problem", "Issue")
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

// Extract section content using multiple methods - returns an array of strings
function extractSectionContent(text: string, ...sectionKeywords: string[]): string[] {
  const results: string[] = [];
  
  // First try to extract by headings
  const headingSections = extractSectionWithHeader(text, ...sectionKeywords);
  if (headingSections && headingSections.length > 0) {
    return headingSections;
  }
  
  // Next try to extract by numbered or bulleted lists
  const listItems = extractListItems(text, ...sectionKeywords);
  if (listItems && listItems.length > 0) {
    return listItems;
  }
  
  // Finally, try to extract by keyword relevance
  const keywords = new RegExp(`(${sectionKeywords.join('|')})`, 'i');
  const paragraphs = text.split('\n\n');
  
  paragraphs.forEach(paragraph => {
    if (keywords.test(paragraph) && paragraph.length > 20) {
      // Clean the paragraph
      const cleaned = paragraph
        .replace(/^[#\s-]*/, '') // Remove leading hashes, spaces, dashes
        .replace(/^\d+\.\s*/, '') // Remove leading numbers with periods
        .trim();
      
      if (cleaned.length > 0) {
        results.push(cleaned);
      }
    }
  });
  
  // Try to extract sentences as a last resort
  if (results.length === 0) {
    const sentences = text.split(/[.!?]+/);
    sentences.forEach(sentence => {
      if (keywords.test(sentence) && sentence.length > 20) {
        const cleaned = sentence.trim();
        if (cleaned.length > 0) {
          results.push(cleaned);
        }
      }
    });
  }
  
  // Only return up to 5 results
  return results.slice(0, 5);
}

// Extract numbered or bulleted list items related to keywords
function extractListItems(text: string, ...keywords: string[]): string[] | null {
  // Find sections with relevant keywords
  const keywordRegex = new RegExp(`(${keywords.join('|')})`, 'i');
  const sections = text.split(/#{1,3}\s+/); // Split by headings
  
  for (const section of sections) {
    if (keywordRegex.test(section)) {
      // Extract list items (numbered or bullet points)
      const listItemRegex = /(?:^|\n)[\s-]*(?:\d+\.|\*|\-)\s+(.+?)(?=(?:\n[\s-]*(?:\d+\.|\*|\-)\s+)|$)/g;
      const items: string[] = [];
      let match;
      
      while ((match = listItemRegex.exec(section)) !== null) {
        if (match[1] && match[1].trim().length > 20) {
          items.push(match[1].trim());
        }
      }
      
      if (items.length > 0) {
        return items.slice(0, 5);
      }
    }
  }
  
  return null;
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
