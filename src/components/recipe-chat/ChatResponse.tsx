
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChatMessage, SuggestedChanges } from '@/types/chat';
import { useResponseFormatter } from './response/hooks/useResponseFormatter';
import { ChangesSummary } from './changes/ChangesSummary';
import { MethodologyExplanation } from './methodology/MethodologyExplanation';

interface ChatResponseProps {
  message: ChatMessage;
  isLatest?: boolean;
}

export function ChatResponse({ message, isLatest = false }: ChatResponseProps) {
  const formattedContent = useResponseFormatter(message);
  
  const displayMessage = message.displayText || formattedContent;
  const showWarningMessage = message.showWarning === true;
  const showChangesPreview = message.changesPreview === true && message.changes_suggested;
  const showMethodology = message.isMethodology === true;

  return (
    <div 
      className={cn(
        "w-full py-2 px-4 rounded-lg",
        "bg-blue-50 border border-blue-100",
        "transition-all duration-200"
      )}
    >
      {/* Type indicator */}
      <div className="flex items-center gap-2 mb-1">
        <Badge variant="outline" className="text-xs bg-white/80">AI</Badge>
        {showMethodology && (
          <Badge variant="secondary" className="text-xs">Methodology</Badge>
        )}
      </div>

      {/* Formatted content */}
      <div className="prose prose-sm max-w-none">
        {showMethodology ? (
          <MethodologyExplanation />
        ) : (
          <>
            {/* Warning message if needed */}
            {showWarningMessage && (
              <Alert className="bg-yellow-50 mb-4 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  The AI assistant may occasionally generate incorrect information. 
                  Please verify details before making significant changes.
                </AlertDescription>
              </Alert>
            )}
            
            {/* Main response content */}
            <div 
              dangerouslySetInnerHTML={{ __html: displayMessage }} 
              className="whitespace-pre-wrap"
            />
            
            {/* Changes preview if available */}
            <AnimatePresence>
              {showChangesPreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4"
                >
                  <ChangesSummary 
                    changes={message.changes_suggested as SuggestedChanges}
                    recipe={message.recipe}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
