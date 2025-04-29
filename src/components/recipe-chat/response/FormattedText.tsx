
import React from 'react';
import { cn } from '@/lib/utils';

interface FormattedTextProps {
  text: string;
  className?: string;
}

export function FormattedText({ text, className }: FormattedTextProps) {
  // Process the text to handle formatting
  const formattedBlocks = text.split('\n\n').map((block, blockIndex) => {
    // Check if the block is a list
    if (block.match(/^[\-*]\s/m)) {
      const items = block.split('\n').filter(Boolean);
      return (
        <ul key={blockIndex} className="list-disc pl-5 space-y-1">
          {items.map((item, itemIndex) => (
            <li key={`${blockIndex}-${itemIndex}`}>
              {item.replace(/^[\-*]\s/, '')}
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
              {item.replace(/^\d+\.\s/, '')}
            </li>
          ))}
        </ol>
      );
    }
    
    // Handle paragraphs and other text
    return (
      <p key={blockIndex} className={blockIndex > 0 ? 'mt-4' : undefined}>
        {processInlineFormatting(block)}
      </p>
    );
  });

  return (
    <div className={cn("text-sm text-neutral-800", className)}>
      {formattedBlocks}
    </div>
  );
}

function processInlineFormatting(text: string) {
  // Split the text based on formatting markers
  const parts = [];
  let currentText = '';
  let inBold = false;
  let inItalic = false;
  
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '*' && text[i + 1] === '*') {
      // Handle bold formatting
      if (currentText) {
        // Add current text with appropriate formatting
        parts.push(
          inBold ? 
            <strong key={`bold-${parts.length}`}>{currentText}</strong> : 
            <span key={`text-${parts.length}`}>{currentText}</span>
        );
        currentText = '';
      }
      inBold = !inBold;
      i++; // Skip the second asterisk
    } else if (text[i] === '_' && !inBold) {
      // Handle italic formatting
      if (currentText) {
        parts.push(
          inItalic ? 
            <em key={`italic-${parts.length}`}>{currentText}</em> : 
            <span key={`text-${parts.length}`}>{currentText}</span>
        );
        currentText = '';
      }
      inItalic = !inItalic;
    } else {
      currentText += text[i];
    }
  }
  
  // Add any remaining text
  if (currentText) {
    parts.push(
      inBold ? 
        <strong key={`bold-${parts.length}`}>{currentText}</strong> : 
        inItalic ? 
          <em key={`italic-${parts.length}`}>{currentText}</em> :
          <span key={`text-${parts.length}`}>{currentText}</span>
    );
  }
  
  return <>{parts}</>;
}
