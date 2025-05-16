
import type { ChangesResponse, InstructionChange } from '@/types/chat';

/**
 * Highlights ingredient mentions in text based on the changes suggested
 */
export function highlightIngredients(text: string, changesSuggested: ChangesResponse | null): string {
  if (!text || !changesSuggested?.ingredients?.items || 
      !Array.isArray(changesSuggested.ingredients.items) || 
      changesSuggested.ingredients.mode === 'none') {
    return text;
  }
  
  let modifiedText = text;
  const processedIngredients = new Set<string>();
  
  changesSuggested.ingredients.items.forEach((ingredient: any) => {
    // Skip invalid ingredient formats
    if (!ingredient || typeof ingredient !== 'object') return;
    
    // Handle both string and object item types
    const ingredientName = typeof ingredient.item === 'string' 
      ? ingredient.item 
      : typeof ingredient.item === 'object' && ingredient.item !== null
        ? String(ingredient.item)
        : null;
        
    if (!ingredientName) return;
    
    // Skip if we already processed this ingredient to prevent duplicate highlighting
    if (processedIngredients.has(ingredientName.toLowerCase())) return;
    processedIngredients.add(ingredientName.toLowerCase());
    
    try {
      // Make sure ingredient mention in text is highlighted with safer regex
      const safeItemText = ingredientName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${safeItemText}\\b`, 'gi');
      modifiedText = modifiedText.replace(regex, `**${ingredientName}**`);
      
      // Also highlight quantity mentions with safer approach
      if (ingredient.qty !== undefined && ingredient.unit) {
        const qtyString = String(ingredient.qty);
        const safeUnitText = ingredient.unit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const qtyRegex = new RegExp(`\\b${qtyString}\\s+${safeUnitText}\\s+(?!\\*\\*)`, 'gi');
        modifiedText = modifiedText.replace(qtyRegex, `**${ingredient.qty} ${ingredient.unit}** `);
      }
    } catch (err) {
      console.warn("Error highlighting ingredient:", err);
    }
  });
  
  return modifiedText;
}

/**
 * Highlights instructions in text based on the changes suggested
 */
export function highlightInstructions(text: string, changesSuggested: ChangesResponse | null): string {
  if (!text || !changesSuggested?.instructions || 
      !Array.isArray(changesSuggested.instructions) || 
      changesSuggested.instructions.length === 0) {
    return text;
  }
  
  let modifiedText = text;
  const processedInstructions = new Set<string>();
  
  changesSuggested.instructions.forEach((instruction) => {
    const instructionText = typeof instruction === 'string' 
      ? instruction 
      : typeof instruction === 'object' && instruction && 'action' in instruction
        ? (instruction as InstructionChange).action
        : '';
    
    if (!instructionText || instructionText.includes('**') || instructionText.length <= 10) return;
    
    // Skip if we already processed this instruction
    if (processedInstructions.has(instructionText.toLowerCase())) return;
    processedInstructions.add(instructionText.toLowerCase());
    
    try {
      // Use word boundaries for more accurate matching
      // Limit the text used for matching to avoid regex issues with very long instructions
      const matchText = instructionText.substring(0, Math.min(50, instructionText.length));
      const safeInstructionText = matchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      const regex = new RegExp(`\\b${safeInstructionText}`, 'g');
      modifiedText = modifiedText.replace(regex, `**${matchText}**`);
    } catch (err) {
      console.warn("Error highlighting instruction text:", err);
    }
  });
  
  return modifiedText;
}

/**
 * Highlights scientific units and nutrition values in text
 */
export function highlightScientificValues(text: string): string {
  // Format scientific units and nutrition values
  // Match patterns like "240 kcal", "28g fat", "0g carbs", "0g protein"
  const scientificRegexes = [
    { pattern: /(\d+)\s*(kcal|calories)/gi, replacement: "**$1 $2**" },
    { pattern: /(\d+)([g])\s+(protein|carbs|fat|fiber|sugar)/gi, replacement: "**$1$2 $3**" },
    { pattern: /(\d+)([%])/gi, replacement: "**$1$2**" },
  ];
  
  // Apply scientific formatting
  let modifiedText = text;
  scientificRegexes.forEach(({ pattern, replacement }) => {
    modifiedText = modifiedText.replace(pattern, replacement);
  });
  
  return modifiedText;
}
