
import React from 'react';
import { extractTextContent } from '../utils/json-parser';
import { highlightIngredients, highlightInstructions, highlightScientificValues } from '../utils/text-highlighter';
import { extractChangesSummary, checkIngredientWarnings } from '../utils/changes-summary';
import { isMethodologyDocument } from '../utils/scientific-content';
import type { ChangesResponse } from '@/types/chat';

interface ResponseFormatterProps {
  response: string;
  changesSuggested: ChangesResponse | null;
}

export function useResponseFormatter({ response, changesSuggested }: ResponseFormatterProps) {
  // Store the original processed text to ensure consistency across re-renders
  const processedTextRef = React.useRef<string | null>(null);
  const originalResponse = React.useRef<string | null>(null);
  
  // Cache the response to prevent reformatting on re-renders
  if (originalResponse.current !== response) {
    originalResponse.current = response;
    processedTextRef.current = null; // Reset cache when response changes
  }
  
  const displayText = React.useMemo(() => {
    // If we've already processed this exact response, return the cached version
    if (processedTextRef.current && response === originalResponse.current) {
      return processedTextRef.current;
    }
    
    if (!response) return '';
    
    try {
      // Extract plain text content from the response
      let text = extractTextContent(response);
      
      // Highlight ingredients
      text = highlightIngredients(text, changesSuggested);
      
      // Highlight instructions
      text = highlightInstructions(text, changesSuggested);
      
      // Highlight scientific values
      text = highlightScientificValues(text);
      
      // Preserve section dividers (commonly used in scientific methodology)
      text = text.replace(/⸻/g, '\n⸻\n');
      
      // Cache the processed text for future re-renders
      processedTextRef.current = text;
      
      return text;
    } catch (e) {
      console.error("Error formatting response:", e);
      return response || 'Error formatting response';
    }
  }, [response, changesSuggested]);

  // Check if there are any ingredient warnings
  const showWarning = React.useMemo(() => {
    return checkIngredientWarnings(changesSuggested);
  }, [changesSuggested]);

  // Extract a summary of the changes
  const changesPreview = React.useMemo(() => {
    return extractChangesSummary(changesSuggested);
  }, [changesSuggested]);

  // Additional helper for checking if this is a methodology document
  const isMethodology = React.useMemo(() => {
    return isMethodologyDocument(displayText);
  }, [displayText]);

  return { displayText, showWarning, changesPreview, isMethodology };
}
