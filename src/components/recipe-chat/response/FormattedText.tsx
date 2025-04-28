
import React from 'react';

interface FormattedTextProps {
  text: string;
}

/**
 * Component to render text with formatting (e.g. bold sections)
 */
export function FormattedText({ text }: FormattedTextProps) {
  return (
    <>
      {text.split(/(\*\*.*?\*\*)/).map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index} className="font-semibold text-primary">{part.slice(2, -2)}</strong>;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}
