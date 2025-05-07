
import React from 'react';
import { Loader2, Brain, ChefHat } from 'lucide-react';

type ProcessingStage = 'sending' | 'analyzing' | 'processing' | 'timeout';

interface ChatProcessingIndicatorProps {
  stage?: ProcessingStage;
  elapsedTime?: number;
}

export function ChatProcessingIndicator({ 
  stage = 'sending',
  elapsedTime = 0 
}: ChatProcessingIndicatorProps) {
  const messages = {
    sending: 'Sending to our culinary scientist...',
    analyzing: 'Analyzing your recipe...',
    processing: 'Crafting the perfect response...',
    timeout: 'This is taking longer than usual...'
  };

  const icons = {
    sending: <Loader2 className="h-4 w-4 mr-2 animate-spin text-green-600" />,
    analyzing: <Brain className="h-4 w-4 mr-2 text-amber-500" />,
    processing: <ChefHat className="h-4 w-4 mr-2 text-blue-500" />,
    timeout: <Loader2 className="h-4 w-4 mr-2 animate-spin text-amber-600" />
  };
  
  // Show a timeout message if it's been more than 20 seconds
  const currentStage = elapsedTime > 20 ? 'timeout' : stage;

  return (
    <div className="flex justify-center py-3 my-2">
      <div className={`inline-flex items-center px-3 py-1.5 ${currentStage === 'timeout' ? 'bg-amber-50/80' : 'bg-white/70'} backdrop-blur-sm border ${currentStage === 'timeout' ? 'border-amber-100' : 'border-slate-100'} rounded-full shadow-sm`}>
        {icons[currentStage]}
        <span className={`text-xs font-medium ${currentStage === 'timeout' ? 'text-amber-600' : 'text-slate-600'}`}>
          {messages[currentStage]}
          {currentStage === 'timeout' && ' Please be patient'}
        </span>
      </div>
    </div>
  );
}
