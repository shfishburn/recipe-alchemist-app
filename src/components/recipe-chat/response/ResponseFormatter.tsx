
import React from 'react';

interface ResponseFormatterProps {
  response: string;
  changesSuggested: any | null;
}

export function useResponseFormatter({ response, changesSuggested }: ResponseFormatterProps) {
  const displayText = React.useMemo(() => {
    if (!response) return '';
    
    try {
      // Enhanced JSON parsing with better text extraction
      let text = '';
      
      try {
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

      // Enhanced ingredient highlighting
      if (changesSuggested?.ingredients?.items && Array.isArray(changesSuggested.ingredients.items)) {
        // Create a map of normalized ingredient names to their display text
        changesSuggested.ingredients.items.forEach((ingredient: any) => {
          if (ingredient && typeof ingredient.item === 'string') {
            // Make sure ingredient mention in text is highlighted
            const regex = new RegExp(`${ingredient.item}`, 'gi');
            text = text.replace(regex, `**${ingredient.item}**`);
            
            // Also highlight quantity mentions
            if (ingredient.qty && ingredient.unit) {
              const qtyRegex = new RegExp(`${ingredient.qty} ${ingredient.unit}\\s+(?!\\*\\*)`, 'gi');
              text = text.replace(qtyRegex, `**${ingredient.qty} ${ingredient.unit}** `);
            }
          }
        });
      }

      // Format instructions with better context
      if (changesSuggested?.instructions && Array.isArray(changesSuggested.instructions)) {
        changesSuggested.instructions.forEach((instruction: string | { action: string }) => {
          const instructionText = typeof instruction === 'string' ? instruction : instruction.action;
          if (instructionText && !instructionText.includes('**')) {
            const regex = new RegExp(
              instructionText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
              'g'
            );
            text = text.replace(regex, `**${instructionText}**`);
          }
        });
      }

      return text;
    } catch (e) {
      console.error("Error formatting response:", e);
      return response || 'Error formatting response';
    }
  }, [response, changesSuggested]);

  const showWarning = React.useMemo(() => {
    if (!changesSuggested?.ingredients?.items) return false;
    
    // Check for any ingredients with warning notes
    return changesSuggested.ingredients.items.some((item: any) => 
      item.notes?.toLowerCase().includes('warning')
    );
  }, [changesSuggested]);

  return { displayText, showWarning };
}
