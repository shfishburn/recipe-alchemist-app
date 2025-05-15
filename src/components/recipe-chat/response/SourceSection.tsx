
import React from 'react';
import { Card } from '@/components/ui/card';
import { ImageIcon, Link as LinkIcon } from 'lucide-react';
import { ChatMessage } from '@/types/chat';

interface SourceSectionProps {
  chatMessage: ChatMessage;
}

export const SourceSection: React.FC<SourceSectionProps> = ({ chatMessage }) => {
  // Only show source info if we have relevant source data
  if (!chatMessage.source_type) return null;

  return (
    <div className="mt-2 mb-4">
      {chatMessage.source_type === 'image' && chatMessage.source_image && (
        <Card className="p-3 flex items-center gap-2 bg-muted/50">
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Analysis based on uploaded image</span>
        </Card>
      )}

      {chatMessage.source_type === 'url' && chatMessage.source_url && (
        <Card className="p-3 flex items-center gap-2 bg-muted/50">
          <LinkIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            Analysis based on URL: 
            <a 
              href={chatMessage.source_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline ml-1 text-blue-600 hover:text-blue-800"
            >
              {chatMessage.source_url}
            </a>
          </span>
        </Card>
      )}
    </div>
  );
};
