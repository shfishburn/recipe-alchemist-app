
import React from 'react';
import { processInlineFormatting } from '../utils/text-formatting';

interface HeadingBlockProps {
  block: string;
  blockIndex: number;
}

export function HeadingBlock({ block, blockIndex }: HeadingBlockProps) {
  const headingText = block.replace(/^#{2,3}\s+/, '');
  return (
    <h3 key={blockIndex} className={`font-semibold ${blockIndex > 0 ? 'mt-4' : 'mt-2'} mb-2 text-gray-800`}>
      {processInlineFormatting(headingText)}
    </h3>
  );
}

export function MethodologyHeading({ block, blockIndex }: HeadingBlockProps) {
  return (
    <h3 key={blockIndex} className="font-semibold text-gray-900 mt-5 mb-3">
      {block.trim()}
    </h3>
  );
}
