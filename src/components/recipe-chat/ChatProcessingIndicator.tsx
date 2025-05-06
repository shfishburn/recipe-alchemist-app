
import React from 'react';
import { Loader2, Brain, ChefHat } from 'lucide-react';

type ProcessingStage = 'sending' | 'analyzing' | 'processing';

interface ChatProcessingIndicatorProps {
  stage?: ProcessingStage;
}

export function ChatProcessingIndicator({ stage = 'sending' }: ChatProcessingIndicatorProps) {
  const messages = {
    sending: 'Sending to our culinary scientist...',
    analyzing: 'Analyzing your recipe...',
    processing: 'Crafting the perfect response...'
  };

  const icons = {
    sending: <Loader2 className="h-4 w-4 mr-2 animate-spin text-green-600" />,
    analyzing: <Brain className="h-4 w-4 mr-2 text-amber-500" />,
    processing: <ChefHat className="h-4 w-4 mr-2 text-blue-500" />
  };

  return (
    <div className="flex justify-center py-3 my-2">
      <div className="inline-flex items-center px-3 py-1.5 bg-white/70 backdrop-blur-sm border border-slate-100 rounded-full shadow-sm">
        {icons[stage]}
        <span className="text-xs text-slate-600 font-medium">{messages[stage]}</span>
      </div>
    </div>
  );
}
