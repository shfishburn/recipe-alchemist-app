
interface ModificationPromptParams {
  recipe: any;
  userRequest: string;
  modificationHistory: any[];
}

// Build a prompt for recipe modification that uses the recipe generation format
export function buildModificationPrompt(params: ModificationPromptParams): string {
  const { recipe, userRequest, modificationHistory } = params;
  
  const recipeText = JSON.stringify(recipe);
  const historyText = modificationHistory.length > 0 
    ? `Previous modifications:\n${modificationHistory
        .map(h => `- Request: ${h.request}\n  Response: ${h.response?.textResponse || JSON.stringify(h.response)}`)
        .join('\n')}`
    : '';

  return `
As a culinary scientist in the López-Alt tradition, modify this existing recipe:

ORIGINAL RECIPE:
${recipeText}

MODIFICATION REQUEST:
${userRequest}

${historyText}

──────── MANDATORY INSTRUCTION DETAILS ────────
• Create a COMPLETE UPDATED RECIPE with ALL fields (ingredients, steps, etc.) even if they remain unchanged
• Use the KENJI LÓPEZ-ALT style with SCIENTIFIC explanations
• MAINTAIN the same recipe structure and format
• If changing ingredients, update all related steps to maintain coherence
• Recalculate nutrition values based on ingredient changes
• Keep all recipe properties intact unless they need to change
• Return the COMPLETE recipe in the same JSON format as the original

──────── IMPORTANT FORMAT INSTRUCTIONS ────────
• RETURN THE ENTIRE RECIPE as a complete JSON with ALL fields
• DO NOT return only the changes
• Maintain the same number of ingredients and steps unless explicitly asked to add/remove
• Follow the same formatting conventions as the original recipe
• Each step MUST include precise temps (°F AND °C) and timing
• Scientific explanation must be included in steps

Please return the COMPLETE updated recipe that I can use as a direct replacement for the original.
`;
}
