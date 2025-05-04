
import React from 'react';
import { processInlineFormatting } from '../utils/text-formatting';

interface ListBlockProps {
  block: string;
  blockIndex: number;
  type: 'bullet' | 'numbered';
}

export function ListBlock({ block, blockIndex, type }: ListBlockProps) {
  const pattern = type === 'bullet' 
    ? /^[\s\t]*[•\-*]\s+\S/m
    : /^[\s\t]*\d+\.\s+\S/m;
    
  const items = block.split(/\n/).filter(item => item.trim().match(pattern));
  
  if (type === 'bullet') {
    return (
      <ul key={blockIndex} className="list-disc pl-5 space-y-1.5 my-2.5">
        {items.map((item, itemIndex) => {
          // Handle nested bullets by checking for indentation
          const indentMatch = item.match(/^(\s+)/);
          const indent = indentMatch ? indentMatch[1].length : 0;
          const indentClass = indent > 2 ? "ml-4" : "";
          
          return (
            <li key={`${blockIndex}-${itemIndex}`} className={`${indentClass} break-words text-sm sm:text-base`}>
              {processInlineFormatting(item.replace(/^[\s\t]*[•\-*]\s+/, ''))}
            </li>
          );
        })}
      </ul>
    );
  } else {
    return (
      <ol key={blockIndex} className="list-decimal pl-5 space-y-1.5 my-2.5">
        {items.map((item, itemIndex) => (
          <li key={`${blockIndex}-${itemIndex}`} className="break-words text-sm sm:text-base">
            {processInlineFormatting(item.replace(/^[\s\t]*\d+\.\s+/, ''))}
          </li>
        ))}
      </ol>
    );
  }
}
