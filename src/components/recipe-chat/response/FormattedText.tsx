
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
  
  return <>{formattedContent}</>;
}
