
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { ChatMessage } from '@/types/chat';

interface SourceSectionProps {
  chatMessage: ChatMessage;
}

export const SourceSection: React.FC<SourceSectionProps> = ({ chatMessage }) => {
  // If there's no source, don't render anything
  if (!chatMessage.source_type || chatMessage.source_type === 'manual') {
    return null;
  }

  return (
    <div className="mt-4 space-y-2">
      {chatMessage.source_type === 'url' && chatMessage.source_url && (
        <div className="bg-muted/40 p-3 rounded-md">
          <div className="text-sm font-medium mb-1">Recipe analyzed from URL:</div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 text-xs"
            asChild
          >
            <a href={chatMessage.source_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3" />
              Visit source
            </a>
          </Button>
        </div>
      )}

      {chatMessage.source_type === 'image' && chatMessage.source_image && (
        <div className="bg-muted/40 p-3 rounded-md">
          <div className="text-sm font-medium mb-2">Recipe analyzed from image:</div>
          <div className="w-full max-w-[200px] rounded-md overflow-hidden">
            <AspectRatio ratio={4/3}>
              <img 
                src={chatMessage.source_image} 
                alt="Recipe source" 
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </div>
        </div>
      )}
    </div>
  );
};
