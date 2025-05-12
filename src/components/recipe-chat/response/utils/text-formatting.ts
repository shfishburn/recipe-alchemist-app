
import React from 'react';

/**
 * Process inline formatting in text and return properly structured React nodes
 * Ensures consistent output for React.Children.only compatibility
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
  
  // Process the text character by character
  for (let i = 0; i < text.length; i++) {
    // Handle bold formatting with **text**
    if (text.substr(i, 2) === '**' && (!codeActive)) {
      // Add accumulated text before the marker
      if (currentText) {
        if (boldActive) {
          parts.push(
            React.createElement('strong', { key: `bold-${i}` },
              italicActive ? React.createElement('em', null, currentText) : currentText
            )
          );
        } else if (italicActive) {
          parts.push(React.createElement('em', { key: `italic-${i}` }, currentText));
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
    if (text[i] === '_' && (!codeActive) && 
        (i === 0 || /\s/.test(text[i-1])) && 
        (i+1 < text.length && !/\s/.test(text[i+1]))) {
      // Add accumulated text before the marker
      if (currentText) {
        if (boldActive) {
          parts.push(
            React.createElement('strong', { key: `bold-${i}` },
              italicActive ? React.createElement('em', null, currentText) : currentText
            )
          );
        } else if (italicActive) {
          parts.push(React.createElement('em', { key: `italic-${i}` }, currentText));
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
    if (text[i] === '`' && (i === 0 || text[i-1] !== '\\')) {
      // Add accumulated text before the marker
      if (currentText) {
        if (boldActive) {
          parts.push(
            React.createElement('strong', { key: `bold-${i}` },
              italicActive ? React.createElement('em', null, currentText) : currentText
            )
          );
        } else if (italicActive) {
          parts.push(React.createElement('em', { key: `italic-${i}` }, currentText));
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
    currentText += text[i];
    
    // Handle end of text
    if (i === text.length - 1 && currentText) {
      if (boldActive) {
        parts.push(
          React.createElement('strong', { 
            key: `bold-${i}`,
            className: "text-recipe-blue"
          }, 
            italicActive ? React.createElement('em', null, currentText) : currentText
          )
        );
      } else if (italicActive) {
        parts.push(React.createElement('em', { key: `italic-${i}` }, currentText));
      } else if (codeActive) {
        parts.push(React.createElement('code', { 
          key: `code-${i}`, 
          className: "px-1 py-0.5 bg-gray-100 rounded" 
        }, currentText));
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
  if (!text || typeof text !== 'string') return false;
  
  const scientificTerms = [
    'maillard', 'reaction', 'chemistry', 'temperature', 'techniques',
    'protein', 'structure', 'starch', 'gelatinization', 'degree',
    'celsius', 'fahrenheit', 'hydration', 'fat', 'emulsion', 'science',
    'methodology', 'analysis', 'nutrition', 'kcal', 'calories', 'macros',
    'standardized', 'breakdown', 'ingredient', 'carbs', 'fiber', 'sugar',
    'sodium', 'summation', 'verification', 'thermal', 'enzyme', 'ph',
    'acid', 'base', 'crystallization', 'polymerization', 'denaturation',
    'coagulation', 'colloid', 'suspension', 'heat transfer', 'conduction',
    'convection', 'radiation', 'caramelization', 'hydrocolloids'
  ];
  
  const lowerText = text.toLowerCase();
  return scientificTerms.some(term => lowerText.includes(term));
}
