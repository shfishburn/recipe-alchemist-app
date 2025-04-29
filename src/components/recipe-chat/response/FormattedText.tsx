
import React from 'react';

interface FormattedTextProps {
  text: string;
}

/**
 * Component to render text with formatting (e.g. bold sections)
 */
export function FormattedText({ text }: FormattedTextProps) {
  // Enhanced formatting for different patterns
  
  // First handle bold text with ** markers
  let formattedContent = text.split(/(\*\*.*?\*\*)/).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-semibold text-primary">{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
  
  // Look for section headers that might be in the text (e.g. "Chemistry:" or "Techniques:")
  const sectionHeaderRegex = /^(Science Notes|Chemistry|Techniques|Troubleshooting|Analysis):\s*/i;
  if (sectionHeaderRegex.test(text)) {
    const parts = text.split(sectionHeaderRegex);
    if (parts.length >= 3) { // The regex creates 3 parts if there's a match
      return (
        <>
          <strong className="font-semibold text-primary block mb-1">{parts[1]}:</strong>
          {parts[2]}
        </>
      );
    }
  }
  
  // Handle scientific terms with special formatting
  const scientificTerms = [
    'Maillard reaction', 'emulsification', 'caramelization', 'denaturation',
    'hydration', 'gelatinization', 'fermentation', 'oxidation', 'reduction',
    'hydrolysis', 'coagulation', 'crystallization', 'acid-base reaction'
  ];
  
  // Create a regex pattern that matches any of the scientific terms (case insensitive)
  const scientificTermPattern = new RegExp(`(${scientificTerms.join('|')})`, 'gi');
  
  // Apply formatting to scientific terms
  let contentWithScientificTerms = React.Children.map(formattedContent, (child) => {
    // Only process string children
    if (typeof child === 'string') {
      const parts = child.split(scientificTermPattern);
      return parts.map((part, i) => {
        // Check if this part matches a scientific term (case insensitive)
        const isScientificTerm = scientificTerms.some(term => 
          part.toLowerCase() === term.toLowerCase()
        );
        
        if (isScientificTerm) {
          return <em key={i} className="text-blue-700 font-medium not-italic">{part}</em>;
        }
        return part;
      });
    }
    return child;
  });
  
  return <>{contentWithScientificTerms}</>;
}
