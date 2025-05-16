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
    if (ingredient && typeof ingredient.item === 'string') {
      // Skip if we already processed this ingredient to prevent duplicate highlighting
      if (processedIngredients.has(ingredient.item.toLowerCase())) return;
      processedIngredients.add(ingredient.item.toLowerCase());
      
      try {
        // Make sure ingredient mention in text is highlighted with safer regex
        const safeItemText = ingredient.item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${safeItemText}\\b`, 'gi');
        modifiedText = modifiedText.replace(regex, `**${ingredient.item}**`);
        
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
    const instructionText = typeof instruction === 'string' ? instruction : instruction.action || '';
    
    if (instructionText && !instructionText.includes('**') && instructionText.length > 10) {
      // Skip if we already processed this instruction
      if (processedInstructions.has(instructionText.toLowerCase())) return;
      processedInstructions.add(instructionText.toLowerCase());
      
      try {
        // Use word boundaries for more accurate matching
        const safeInstructionText = instructionText
          .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          .substring(0, 50); // Use first 50 chars max for matching to avoid regex issues
        
        const regex = new RegExp(`\\b${safeInstructionText}`, 'g');
        modifiedText = modifiedText.replace(regex, `**${instructionText.substring(0, 50)}**`);
      } catch (err) {
        console.warn("Error highlighting instruction text:", err);
      }
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
