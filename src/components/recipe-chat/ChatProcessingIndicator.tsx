
import React, { useState, useEffect } from 'react';
import { Loader2, Brain, ChefHat, Sparkles } from 'lucide-react';

type ProcessingStage = 'sending' | 'analyzing' | 'processing' | 'completing';

interface ChatProcessingIndicatorProps {
  stage?: ProcessingStage;
}

export function ChatProcessingIndicator({ stage = 'sending' }: ChatProcessingIndicatorProps) {
  const [currentStage, setCurrentStage] = useState<ProcessingStage>(stage);
  const [dots, setDots] = useState('');
  
  // Auto-progress through stages for better UX
  useEffect(() => {
    setCurrentStage(stage);
    
    // If we start with 'sending', set up auto-progression
    if (stage === 'sending') {
      const stageTimers: ReturnType<typeof setTimeout>[] = [];
      
      // Progress to 'analyzing' after 2 seconds
      stageTimers.push(setTimeout(() => {
        setCurrentStage('analyzing');
      }, 2000));
      
      // Progress to 'processing' after 5 seconds
      stageTimers.push(setTimeout(() => {
        setCurrentStage('processing');
      }, 5000));
      
      // Progress to 'completing' after 12 seconds
      stageTimers.push(setTimeout(() => {
        setCurrentStage('completing');
      }, 12000));
      
      return () => stageTimers.forEach(timer => clearTimeout(timer));
    }
    
    return undefined;
  }, [stage]);
  
  // Animated loading dots
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 400);
    
    return () => clearInterval(dotInterval);
  }, []);

  const messages = {
    sending: `Sending to our culinary scientist${dots}`,
    analyzing: `Analyzing your recipe${dots}`,
    processing: `Crafting the perfect response${dots}`,
    completing: `Almost done${dots}`
  };

  const icons = {
    sending: <Loader2 className="h-4 w-4 mr-2 animate-spin text-green-600" />,
    analyzing: <Brain className="h-4 w-4 mr-2 animate-pulse text-amber-500" />,
    processing: <ChefHat className="h-4 w-4 mr-2 text-blue-500" />,
    completing: <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
  };

  return (
    <div className="flex justify-center py-3 my-2">
      <div className="inline-flex items-center px-3 py-1.5 bg-white/70 backdrop-blur-sm border border-slate-100 rounded-full shadow-sm">
        {icons[currentStage]}
        <span className="text-xs text-slate-600 font-medium">{messages[currentStage]}</span>
      </div>
    </div>
  );
}
