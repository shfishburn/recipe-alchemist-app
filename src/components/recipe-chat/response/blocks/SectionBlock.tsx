
import React from 'react';
import { processInlineFormatting } from '../utils/text-formatting';

interface SectionBlockProps {
  block: string;
  blockIndex: number;
}

export function SectionBlock({ block, blockIndex }: SectionBlockProps) {
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
