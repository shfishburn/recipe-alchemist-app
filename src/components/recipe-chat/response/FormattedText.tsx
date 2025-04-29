
import React from 'react';
import { cn } from '@/lib/utils';

interface FormattedTextProps {
  text: string;
  className?: string;
}

export function FormattedText({ text, className }: FormattedTextProps) {
  // Process the text to handle formatting with improved reliability
  const formattedBlocks = React.useMemo(() => {
    if (!text || typeof text !== 'string') {
      return [<p key="empty">No content available</p>];
    }
    
    // Split by double newlines to separate blocks (paragraphs, lists, etc.)
    return text.split(/\n\n+/).map((block, blockIndex) => {
      if (!block.trim()) {
        return null; // Skip empty blocks
      }
      
      // Check if the block is a list with better regex matching
      if (block.match(/^[\-*]\s+\S/m)) {
        const items = block.split(/\n/).filter(item => item.trim().match(/^[\-*]\s+\S/));
        
        return (
          <ul key={blockIndex} className="list-disc pl-5 space-y-1 my-2">
            {items.map((item, itemIndex) => (
              <li key={`${blockIndex}-${itemIndex}`}>
                {processInlineFormatting(item.replace(/^[\-*]\s+/, ''))}
              </li>
            ))}
          </ul>
        );
      }
      
      // Check if the block is a numbered list with enhanced detection
      if (block.match(/^\d+\.\s+\S/m)) {
        const items = block.split(/\n/).filter(item => item.trim().match(/^\d+\.\s+\S/));
        
        return (
          <ol key={blockIndex} className="list-decimal pl-5 space-y-1 my-2">
            {items.map((item, itemIndex) => (
              <li key={`${blockIndex}-${itemIndex}`}>
                {processInlineFormatting(item.replace(/^\d+\.\s+/, ''))}
              </li>
            ))}
          </ol>
        );
      }
      
      // Handle headings (## Heading) with more specific pattern matching
      if (block.match(/^#{2,3}\s+\S/)) {
        const headingText = block.replace(/^#{2,3}\s+/, '');
        return (
          <h3 key={blockIndex} className={`font-semibold ${blockIndex > 0 ? 'mt-4' : 'mt-2'} mb-2 text-gray-800`}>
            {processInlineFormatting(headingText)}
          </h3>
        );
      }
      
      // Handle paragraphs and other text with proper spacing
      return (
        <p key={blockIndex} className={blockIndex > 0 ? 'mt-3' : undefined}>
          {processInlineFormatting(block)}
        </p>
      );
    }).filter(Boolean); // Remove null entries
  }, [text]);

  return (
    <div className={cn("text-sm text-neutral-800", className)}>
      {formattedBlocks}
    </div>
  );
}

// Enhanced inline formatting processor with improved pattern matching
function processInlineFormatting(text: string): React.ReactNode[] {
  if (!text || typeof text !== 'string') {
    return [text];
  }
  
  // Initialize result array and processing state
  const parts: React.ReactNode[] = [];
  let currentText = '';
  let boldActive = false;
  let italicActive = false;
  let codeActive = false;
  
  // Process the text character by character for more reliable formatting
  for (let i = 0; i < text.length; i++) {
    // Check for formatting markers
    if (text.substr(i, 2) === '**' && (!codeActive)) {
      // Add accumulated text before the marker
      if (currentText) {
        parts.push(currentText);
        currentText = '';
      }
      
      // Toggle bold state
      boldActive = !boldActive;
      i++; // Skip the second asterisk
      continue;
    }
    
    if (text[i] === '_' && (!codeActive) && (!text[i-1] || /\s/.test(text[i-1])) && (!text[i+1] || !/\s/.test(text[i+1]))) {
      // Add accumulated text before the marker
      if (currentText) {
        parts.push(currentText);
        currentText = '';
      }
      
      // Toggle italic state
      italicActive = !italicActive;
      continue;
    }
    
    if (text[i] === '`' && (i === 0 || text[i-1] !== '\\')) {
      // Add accumulated text before the marker
      if (currentText) {
        parts.push(boldActive ? <strong key={`bold-${i}`}>{italicActive ? <em>{currentText}</em> : currentText}</strong> : 
                 italicActive ? <em key={`italic-${i}`}>{currentText}</em> : currentText);
        currentText = '';
      }
      
      // Toggle code state
      codeActive = !codeActive;
      continue;
    }
    
    // Add the character to the current text segment
    currentText += text[i];
    
    // Check if we're at the end of the input
    if (i === text.length - 1 && currentText) {
      parts.push(boldActive ? <strong key={`bold-${i}`}>{italicActive ? <em>{currentText}</em> : currentText}</strong> : 
               italicActive ? <em key={`italic-${i}`}>{currentText}</em> : 
               codeActive ? <code key={`code-${i}`} className="px-1 py-0.5 bg-gray-100 rounded">{currentText}</code> : currentText);
    }
  }
  
  return parts;
}
