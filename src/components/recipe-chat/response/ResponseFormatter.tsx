
import React from 'react';
import type { ChangesResponse } from '@/types/chat';

interface ResponseFormatterProps {
  response: string;
  changesSuggested: ChangesResponse | null;
}

export function useResponseFormatter({ response, changesSuggested }: ResponseFormatterProps) {
  // Store the original processed text to ensure consistency across re-renders
  const processedTextRef = React.useRef<string | null>(null);
  
  const displayText = React.useMemo(() => {
    // If we've already processed this exact response, return the cached version
    if (processedTextRef.current && response === processedTextRef.current) {
      return processedTextRef.current;
    }
    
    if (!response) return '';
    
    try {
      // Enhanced JSON parsing with better text extraction
      let text = '';
      
      try {
        // First, try parsing as JSON
        const parsedResponse = JSON.parse(response);
        // Extract the text content from the parsed JSON
        text = parsedResponse.textResponse || parsedResponse.response || '';
      } catch (e) {
        // If it's not valid JSON, use the raw response as text
        text = response;
      }
      
      // If we still don't have text, use the raw response
      if (!text && typeof response === 'string') {
        text = response;
      }
      
      // Clean up the response by removing any remaining JSON syntax markers
      text = text
        .replace(/^\s*{/g, '')
        .replace(/}\s*$/g, '')
        .replace(/"textResponse":/g, '')
        .replace(/"response":/g, '')
        .replace(/^["']|["']$/g, '')
        .trim();

      // Improved formatting for scientific analysis sections with more specific pattern matching
      const sections = [
        { name: "Science Notes", regex: /#+\s*Science Notes/i },
        { name: "Chemistry", regex: /#+\s*Chemistry/i },
        { name: "Techniques", regex: /#+\s*Techniques/i },
        { name: "Troubleshooting", regex: /#+\s*Troubleshooting/i },
        { name: "Analysis", regex: /#+\s*Analysis/i }
      ];
      
      // Apply formatting to section headers with safer string replacement
      for (const section of sections) {
        text = text.replace(section.regex, match => `**${section.name}:**`);
      }

      // Enhanced ingredient highlighting with defensive checks
      if (changesSuggested?.ingredients?.items && 
          Array.isArray(changesSuggested.ingredients.items) && 
          changesSuggested.ingredients.mode !== 'none') {
        
        // Create a map of normalized ingredient names to their display text
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
              text = text.replace(regex, `**${ingredient.item}**`);
              
              // Also highlight quantity mentions with safer approach
              if (ingredient.qty !== undefined && ingredient.unit) {
                const qtyString = String(ingredient.qty);
                const safeUnitText = ingredient.unit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const qtyRegex = new RegExp(`\\b${qtyString}\\s+${safeUnitText}\\s+(?!\\*\\*)`, 'gi');
                text = text.replace(qtyRegex, `**${ingredient.qty} ${ingredient.unit}** `);
              }
            } catch (err) {
              console.warn("Error highlighting ingredient:", err);
              // Continue processing other ingredients
            }
          }
        });
      }

      // Format instructions with improved safety
      if (changesSuggested?.instructions && 
          Array.isArray(changesSuggested.instructions) && 
          changesSuggested.instructions.length > 0) {
        
        const processedInstructions = new Set<string>();
        
        changesSuggested.instructions.forEach((instruction: string | { action: string }) => {
          const instructionText = typeof instruction === 'string' ? instruction : instruction.action;
          
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
              text = text.replace(regex, `**${instructionText.substring(0, 50)}**`);
            } catch (err) {
              console.warn("Error highlighting instruction text:", err);
              // Continue with other instructions
            }
          }
        });
      }
      
      // Cache the processed text for future re-renders
      processedTextRef.current = text;
      
      return text;
    } catch (e) {
      console.error("Error formatting response:", e);
      return response || 'Error formatting response';
    }
  }, [response, changesSuggested]);

  const showWarning = React.useMemo(() => {
    if (!changesSuggested?.ingredients?.items || 
        !Array.isArray(changesSuggested.ingredients.items)) {
      return false;
    }
    
    // Check for any ingredients with warning notes
    return changesSuggested.ingredients.items.some((item: any) => 
      item?.notes?.toLowerCase?.().includes('warning')
    );
  }, [changesSuggested]);

  // Extract a summary of the changes with improved null safety
  const changesPreview = React.useMemo(() => {
    if (!changesSuggested) return null;
    
    const summary = {
      hasTitle: !!changesSuggested.title,
      hasIngredients: changesSuggested.ingredients?.items && 
                    Array.isArray(changesSuggested.ingredients.items) && 
                    changesSuggested.ingredients.items.length > 0 &&
                    changesSuggested.ingredients.mode !== 'none',
      hasInstructions: changesSuggested.instructions && 
                     Array.isArray(changesSuggested.instructions) && 
                     changesSuggested.instructions.length > 0,
      hasScienceNotes: changesSuggested.science_notes && 
                     Array.isArray(changesSuggested.science_notes) && 
                     changesSuggested.science_notes.length > 0,
      ingredientCount: (changesSuggested.ingredients?.items?.length || 0),
      instructionCount: (changesSuggested.instructions?.length || 0),
      scienceNoteCount: (changesSuggested.science_notes?.length || 0),
      ingredientMode: changesSuggested.ingredients?.mode || 'none'
    };
    
    return summary;
  }, [changesSuggested]);

  return { displayText, showWarning, changesPreview };
}
