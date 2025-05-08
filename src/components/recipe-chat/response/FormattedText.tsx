
import React from 'react';
import { cn } from '@/lib/utils';
import { ListBlock } from './blocks/ListBlock';
import { SectionBlock } from './blocks/SectionBlock';
import { HeadingBlock, MethodologyHeading } from './blocks/HeadingBlock';
import { processInlineFormatting, containsScientificContent } from './utils/text-formatting';
import { formatNutritionValue } from '@/components/ui/unit-display';

interface FormattedTextProps {
  text: string;
  className?: string;
  preserveWhitespace?: boolean;
  forceScientific?: boolean;
}

// Helper function to format nutrition values in text
const formatNutritionValues = (text: string): string => {
  // Find patterns like "123.45 calories" or "67.89g protein" and round to integers
  return text.replace(/(\d+\.\d+)(\s*)(calories|kcal|g|mg|mcg|IU)/gi, (match, number, space, unit) => {
    const roundedValue = formatNutritionValue(parseFloat(number));
    return `${roundedValue}${space}${unit}`;
  });
};

export function FormattedText({ 
  text, 
  className,
  preserveWhitespace = false,
  forceScientific = false
}: FormattedTextProps) {
  // Process the text to handle formatting with improved scientific content parsing
  const formattedBlocks = React.useMemo(() => {
    if (!text || typeof text !== 'string') {
      return [<p key="empty">No content available</p>];
    }
    
    // Format nutrition values to whole numbers before processing blocks
    const formattedText = formatNutritionValues(text);
    
    // Enhanced block splitting with preservation of structured content
    const blockSeparator = preserveWhitespace ? /(\n\n+|\r\n\r\n+)/ : /\n\n+/;
    const blocks = formattedText.split(blockSeparator).filter(block => block.trim());
    
    // Process each block with specific formatting rules
    return blocks.map((block, blockIndex) => {
      if (!block.trim()) {
        return null; // Skip empty blocks
      }
      
      // Special section header handling (like "Nutrition Analysis Methodology")
      if (block.match(/^[\w\s-]+\s*Methodology$/im) || 
          block.match(/^[\w\s-]+\s*Analysis$/im) ||
          block.match(/^Summary of Key Principles$/im)) {
        return <MethodologyHeading block={block} blockIndex={blockIndex} />;
      }
      
      // Dedicated handling for numbered sections with numeric or dash prefixes
      if (block.match(/^\d+\.\s+[\w\s]/m)) {
        return <SectionBlock block={block} blockIndex={blockIndex} />;
      }
      
      // Enhanced detection of bullet point lists with better pattern matching
      if (block.match(/^[\s\t]*[•\-*]\s+\S/m)) {
        return <ListBlock block={block} blockIndex={blockIndex} type="bullet" />;
      }
      
      // Enhanced handling for numeric lists with better numbering preservation
      if (block.match(/^[\s\t]*\d+\.\s+\S/m)) {
        return <ListBlock block={block} blockIndex={blockIndex} type="numbered" />;
      }
      
      // Enhanced heading pattern matching with scientific headers
      if (block.match(/^#{1,3}\s+[\w\s]/)) {
        return <HeadingBlock block={block} blockIndex={blockIndex} />;
      }
      
      // Enhanced section divider handling (common in scientific content)
      if (block.match(/^[⸻\-]{3,}$/)) {
        return <hr key={blockIndex} className="my-4 border-gray-200" />;
      }
      
      // Handle plain paragraphs with proper spacing
      return (
        <p key={blockIndex} className={`${blockIndex > 0 ? 'mt-3' : ''} break-words`}>
          {processInlineFormatting(block)}
        </p>
      );
    }).filter(Boolean); // Remove null entries
  }, [text, preserveWhitespace]);

  // Detect if this is scientific content or force scientific styling
  const isScientific = forceScientific || (text ? containsScientificContent(text) : false);

  return (
    <div className={cn(
      "text-sm break-words overflow-hidden", 
      isScientific ? 'scientific-content' : 'text-neutral-800',
      className
    )}>
      {formattedBlocks}
    </div>
  );
}
