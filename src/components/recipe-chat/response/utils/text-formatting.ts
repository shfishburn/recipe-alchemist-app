
import React from 'react';

/**
 * Process inline formatting in text with enhanced styling for ingredients
 */
export function processInlineFormatting(text: string): React.ReactNode[] {
  if (!text || typeof text !== 'string') {
    return [text];
  }
  
  // Initialize result array and processing state
  const parts: React.ReactNode[] = [];
  let currentText = '';
  let boldActive = false;
  let italicActive = false;
  let codeActive = false;
  
  // Enhanced scientific notation support
  const processedText = text
    // Handle temperature formats like 350°F, 175°C
    .replace(/(\d+)°([FC])/g, '$1°$2')
    // Handle fractions like 1/2, 3/4
    .replace(/(\d+)\/(\d+)/g, '$1/$2')
    // Handle nutrition units like 28g, 240 kcal
    .replace(/(\d+)(\s*)(g|mg|kg|kcal|cal)/g, '$1$2$3')
    // Handle percentages
    .replace(/(\d+)(\s*)(%)/g, '$1$2$3');
  
  // Process the text character by character for more reliable formatting
  for (let i = 0; i < processedText.length; i++) {
    // Handle bold formatting with **text**
    if (processedText.substr(i, 2) === '**' && (!codeActive)) {
      // Add accumulated text before the marker
      if (currentText) {
        if (boldActive) {
          parts.push(
            <strong key={`bold-${i}`}>
              {italicActive ? <em>{currentText}</em> : currentText}
            </strong>
          );
        } else if (italicActive) {
          parts.push(<em key={`italic-${i}`}>{currentText}</em>);
        } else {
          parts.push(currentText);
        }
        currentText = '';
      }
      
      // Toggle bold state
      boldActive = !boldActive;
      i++; // Skip the second asterisk
      continue;
    }
    
    // Handle italic formatting with _text_
    if (processedText[i] === '_' && (!codeActive) && 
        (!processedText[i-1] || /\s/.test(processedText[i-1])) && 
        (!processedText[i+1] || !/\s/.test(processedText[i+1]))) {
      // Add accumulated text before the marker
      if (currentText) {
        if (boldActive) {
          parts.push(
            <strong key={`bold-${i}`}>
              {italicActive ? <em>{currentText}</em> : currentText}
            </strong>
          );
        } else if (italicActive) {
          parts.push(<em key={`italic-${i}`}>{currentText}</em>);
        } else {
          parts.push(currentText);
        }
        currentText = '';
      }
      
      // Toggle italic state
      italicActive = !italicActive;
      continue;
    }
    
    // Handle code formatting with `text`
    if (processedText[i] === '`' && (i === 0 || processedText[i-1] !== '\\')) {
      // Add accumulated text before the marker
      if (currentText) {
        if (boldActive) {
          parts.push(
            <strong key={`bold-${i}`}>
              {italicActive ? <em>{currentText}</em> : currentText}
            </strong>
          );
        } else if (italicActive) {
          parts.push(<em key={`italic-${i}`}>{currentText}</em>);
        } else {
          parts.push(currentText);
        }
        currentText = '';
      }
      
      // Toggle code state
      codeActive = !codeActive;
      continue;
    }
    
    // Add character to current text segment
    currentText += processedText[i];
    
    // Handle end of text
    if (i === processedText.length - 1 && currentText) {
      if (boldActive) {
        // Use enhanced styling for ingredients (bolded items)
        parts.push(
          <span 
            key={`bold-${i}`} 
            className="font-semibold text-recipe-blue bg-recipe-blue/5 px-1.5 py-0.5 rounded-md border border-recipe-blue/10"
          >
            {italicActive ? <em>{currentText}</em> : currentText}
          </span>
        );
      } else if (italicActive) {
        parts.push(<em key={`italic-${i}`}>{currentText}</em>);
      } else if (codeActive) {
        parts.push(<code key={`code-${i}`} className="px-1 py-0.5 bg-gray-100 rounded">{currentText}</code>);
      } else {
        parts.push(currentText);
      }
    }
  }
  
  return parts;
}

/**
 * Checks if text contains scientific content
 */
export function containsScientificContent(text: string): boolean {
  const scientificTerms = [
    'maillard', 'reaction', 'chemistry', 'temperature', 'techniques',
    'protein', 'structure', 'starch', 'gelatinization', 'degree',
    'celsius', 'fahrenheit', 'hydration', 'fat', 'emulsion', 'science',
    'methodology', 'analysis', 'nutrition', 'kcal', 'calories', 'macros',
    'standardized', 'breakdown', 'ingredient', 'carbs', 'fiber', 'sugar',
    'sodium', 'summation', 'verification'
  ];
  
  const lowerText = text.toLowerCase();
  return scientificTerms.some(term => lowerText.includes(term));
}
