
import React from 'react';
import { useResponseFormatter } from './hooks/useResponseFormatter';

interface ResponseFormatterProps {
  response: string;
  changesSuggested: any | null;
}

export function ResponseFormatter({ response, changesSuggested }: ResponseFormatterProps) {
  const { displayText } = useResponseFormatter({ 
    response, 
    changesSuggested 
  });

  return (
    <div className="text-sm text-gray-800 whitespace-pre-wrap">
      {displayText}
    </div>
  );
}

// Re-export the hook for easy imports
export { useResponseFormatter };
