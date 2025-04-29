
import React from 'react';
import { cn } from '@/lib/utils';

interface FormattedTextProps {
  text: string;
  className?: string;
}

export function FormattedText({ text, className }: FormattedTextProps) {
  // Process the text to handle formatting
  const formattedBlocks = React.useMemo(() => {
    return text.split('\n\n').map((block, blockIndex) => {
      // Check if the block is a list
      if (block.match(/^[\-*]\s/m)) {
        const items = block.split('\n').filter(Boolean);
        return (
          <ul key={blockIndex} className="list-disc pl-5 space-y-1">
            {items.map((item, itemIndex) => (
              <li key={`${blockIndex}-${itemIndex}`}>
                {processInlineFormatting(item.replace(/^[\-*]\s/, ''))}
              </li>
            ))}
          </ul>
        );
      }
      
      // Check if the block is a numbered list
      if (block.match(/^\d+\.\s/m)) {
        const items = block.split('\n').filter(Boolean);
        return (
          <ol key={blockIndex} className="list-decimal pl-5 space-y-1">
            {items.map((item, itemIndex) => (
              <li key={`${blockIndex}-${itemIndex}`}>
                {processInlineFormatting(item.replace(/^\d+\.\s/, ''))}
              </li>
            ))}
          </ol>
        );
      }
      
      // Handle headings (## Heading)
      if (block.match(/^#{2,3}\s/)) {
        const headingText = block.replace(/^#{2,3}\s/, '');
        return (
          <h3 key={blockIndex} className={`font-semibold ${blockIndex > 0 ? 'mt-4' : 'mt-2'} text-gray-800`}>
            {processInlineFormatting(headingText)}
          </h3>
        );
      }
      
      // Handle paragraphs and other text
      return (
        <p key={blockIndex} className={blockIndex > 0 ? 'mt-4' : undefined}>
          {processInlineFormatting(block)}
        </p>
      );
    });
  }, [text]);

  return (
    <div className={cn("text-sm text-neutral-800", className)}>
      {formattedBlocks}
    </div>
  );
}

function processInlineFormatting(text: string): React.ReactNode[] {
  // Enhanced regex-based approach for better text processing
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  
  // Find all formatting markers in the text
  const matches = [...text.matchAll(/(\*\*|_|`)/g)];
  
  if (matches.length === 0) {
    // No formatting, return the text as is
    return [text];
  }
  
  // Track active formatting
  let boldActive = false;
  let italicActive = false;
  let codeActive = false;
  
  matches.forEach((match, i) => {
    const matchIndex = match.index as number;
    const matchText = match[0];
    
    if (matchIndex > currentIndex) {
      // Add text before the formatting marker
      parts.push(text.substring(currentIndex, matchIndex));
    }
    
    // Determine which formatting to toggle
    if (matchText === '**') {
      boldActive = !boldActive;
    } else if (matchText === '_') {
      italicActive = !italicActive;
    } else if (matchText === '`') {
      codeActive = !codeActive;
    }
    
    // Move current index past this marker
    currentIndex = matchIndex + matchText.length;
    
    // If this is an opening marker, get text until the next matching marker
    if ((boldActive && matchText === '**') || 
        (italicActive && matchText === '_') || 
        (codeActive && matchText === '`')) {
      
      // Find the closing marker
      const endMatch = matches[i + 1];
      if (endMatch && endMatch[0] === matchText) {
        const endIndex = endMatch.index as number;
        const content = text.substring(currentIndex, endIndex);
        
        // Apply formatting
        if (matchText === '**') {
          parts.push(<strong key={`bold-${i}`}>{content}</strong>);
        } else if (matchText === '_') {
          parts.push(<em key={`italic-${i}`}>{content}</em>);
        } else if (matchText === '`') {
          parts.push(<code key={`code-${i}`} className="px-1 py-0.5 bg-gray-100 rounded">{content}</code>);
        }
        
        // Move past the closing marker
        currentIndex = endIndex + matchText.length;
        
        // Skip the next match since we've processed it
        matches.splice(i + 1, 1);
      }
    }
  });
  
  // Add any remaining text
  if (currentIndex < text.length) {
    parts.push(text.substring(currentIndex));
  }
  
  return parts;
}
