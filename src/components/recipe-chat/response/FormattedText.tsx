
import React from 'react';
import { cn } from '@/lib/utils';

interface FormattedTextProps {
  text: string;
  className?: string;
  preserveWhitespace?: boolean;
}

export function FormattedText({ 
  text, 
  className,
  preserveWhitespace = false 
}: FormattedTextProps) {
  // Process the text to handle formatting with improved scientific content parsing
  const formattedBlocks = React.useMemo(() => {
    if (!text || typeof text !== 'string') {
      return [<p key="empty">No content available</p>];
    }
    
    // Enhanced block splitting with preservation of structured content
    const blockSeparator = preserveWhitespace ? /(\n\n+|\r\n\r\n+)/ : /\n\n+/;
    const blocks = text.split(blockSeparator).filter(block => block.trim());
    
    // Process each block with specific formatting rules
    return blocks.map((block, blockIndex) => {
      if (!block.trim()) {
        return null; // Skip empty blocks
      }
      
      // Special section header handling (like "Nutrition Analysis Methodology")
      if (block.match(/^[\w\s-]+\s*Methodology$/im) || 
          block.match(/^[\w\s-]+\s*Analysis$/im) ||
          block.match(/^Summary of Key Principles$/im)) {
        return (
          <h3 key={blockIndex} className="font-semibold text-gray-900 mt-5 mb-3">
            {block.trim()}
          </h3>
        );
      }
      
      // Dedicated handling for numbered sections with numeric or dash prefixes
      if (block.match(/^\d+\.\s+[\w\s]/m)) {
        const title = block.split('\n')[0].trim();
        const content = block.split('\n').slice(1).join('\n').trim();
        
        return (
          <div key={blockIndex} className="mb-4">
            <h4 className="font-medium text-gray-800 mb-1">{title}</h4>
            <div className="pl-1">
              {processInlineFormatting(content)}
            </div>
          </div>
        );
      }
      
      // Enhanced detection of bullet point lists with better pattern matching
      if (block.match(/^[\s\t]*[•\-*]\s+\S/m)) {
        const items = block.split(/\n/).filter(item => item.trim().match(/^[\s\t]*[•\-*]\s+\S/));
        
        return (
          <ul key={blockIndex} className="list-disc pl-5 space-y-1 my-2">
            {items.map((item, itemIndex) => {
              // Handle nested bullets by checking for indentation
              const indentMatch = item.match(/^(\s+)/);
              const indent = indentMatch ? indentMatch[1].length : 0;
              const indentClass = indent > 2 ? "ml-4" : "";
              
              return (
                <li key={`${blockIndex}-${itemIndex}`} className={indentClass}>
                  {processInlineFormatting(item.replace(/^[\s\t]*[•\-*]\s+/, ''))}
                </li>
              );
            })}
          </ul>
        );
      }
      
      // Enhanced handling for numeric lists with better numbering preservation
      if (block.match(/^[\s\t]*\d+\.\s+\S/m)) {
        const items = block.split(/\n/).filter(item => item.trim().match(/^[\s\t]*\d+\.\s+\S/));
        
        return (
          <ol key={blockIndex} className="list-decimal pl-5 space-y-1 my-2">
            {items.map((item, itemIndex) => (
              <li key={`${blockIndex}-${itemIndex}`}>
                {processInlineFormatting(item.replace(/^[\s\t]*\d+\.\s+/, ''))}
              </li>
            ))}
          </ol>
        );
      }
      
      // Enhanced heading pattern matching with scientific headers
      if (block.match(/^#{2,3}\s+[\w\s]/)) {
        const headingText = block.replace(/^#{2,3}\s+/, '');
        return (
          <h3 key={blockIndex} className={`font-semibold ${blockIndex > 0 ? 'mt-4' : 'mt-2'} mb-2 text-gray-800`}>
            {processInlineFormatting(headingText)}
          </h3>
        );
      }
      
      // Enhanced section divider handling (common in scientific content)
      if (block.match(/^[⸻\-]{3,}$/)) {
        return <hr key={blockIndex} className="my-4 border-gray-200" />;
      }
      
      // Handle plain paragraphs with proper spacing
      return (
        <p key={blockIndex} className={blockIndex > 0 ? 'mt-3' : undefined}>
          {processInlineFormatting(block)}
        </p>
      );
    }).filter(Boolean); // Remove null entries
  }, [text, preserveWhitespace]);

  return (
    <div className={cn("text-sm text-neutral-800", className)}>
      {formattedBlocks}
    </div>
  );
}

// Enhanced inline formatting processor with scientific notation support
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
        parts.push(boldActive ? 
          <strong key={`bold-${i}`}>{italicActive ? <em>{currentText}</em> : currentText}</strong> : 
          italicActive ? <em key={`italic-${i}`}>{currentText}</em> : currentText
        );
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
        parts.push(boldActive ? 
          <strong key={`bold-${i}`}>{italicActive ? <em>{currentText}</em> : currentText}</strong> : 
          italicActive ? <em key={`italic-${i}`}>{currentText}</em> : currentText
        );
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
        parts.push(boldActive ? 
          <strong key={`bold-${i}`}>{italicActive ? <em>{currentText}</em> : currentText}</strong> : 
          italicActive ? <em key={`italic-${i}`}>{currentText}</em> : currentText
        );
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
      parts.push(boldActive ? 
        <strong key={`bold-${i}`}>{italicActive ? <em>{currentText}</em> : currentText}</strong> : 
        italicActive ? <em key={`italic-${i}`}>{currentText}</em> : 
        codeActive ? <code key={`code-${i}`} className="px-1 py-0.5 bg-gray-100 rounded">{currentText}</code> : 
        currentText
      );
    }
  }
  
  return parts;
}
