
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  isOptimistic?: boolean;
  chatMessage?: ChatMessageType;
  onFollowUpClick?: (question: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isUser,
  isOptimistic = false,
  chatMessage,
  onFollowUpClick
}) => {
  const [showFullText, setShowFullText] = useState(false);
  const messageLength = message?.length || 0;
  const isLongMessage = messageLength > 500;
  const displayedMessage = !showFullText && isLongMessage
    ? message.substring(0, 500) + '...'
    : message;
  
  // Function to handle follow-up question click
  const handleFollowUpClick = (question: string) => {
    if (onFollowUpClick) {
      onFollowUpClick(question);
    }
  };
  
  // Determine if we should show follow-up questions
  const hasFollowUpQuestions = chatMessage?.follow_up_questions && 
                              Array.isArray(chatMessage.follow_up_questions) && 
                              chatMessage.follow_up_questions.length > 0;

  return (
    <div className={cn(
      "flex w-full items-start gap-4 mb-4",
      isUser ? "justify-start" : "justify-start"
    )}>
      <Avatar className={isOptimistic ? "opacity-50" : ""}>
        {isUser ? (
          <>
            <AvatarFallback><User size={18} /></AvatarFallback>
            <AvatarImage src="/user-avatar.png" alt="User" />
          </>
        ) : (
          <>
            <AvatarFallback>AI</AvatarFallback>
            <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
          </>
        )}
      </Avatar>
      
      <div className={cn(
        "flex flex-col w-full max-w-[85%]",
        isOptimistic ? "opacity-50" : ""
      )}>
        <Card className={cn(
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted"
        )}>
          <CardContent className="p-4 whitespace-pre-wrap">
            {isOptimistic ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Waiting for response...</span>
              </div>
            ) : (
              <>
                <div className="prose dark:prose-invert max-w-none">
                  {displayedMessage}
                </div>
                
                {isLongMessage && (
                  <Button 
                    variant="link" 
                    className="px-0 mt-2" 
                    onClick={() => setShowFullText(!showFullText)}
                  >
                    {showFullText ? 'Show less' : 'Show more'}
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Follow-up questions if available */}
        {!isUser && hasFollowUpQuestions && !isOptimistic && (
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs text-muted-foreground">Suggested follow-up:</span>
            {chatMessage?.follow_up_questions?.map((question, index) => (
              <Badge 
                key={index}
                className="cursor-pointer hover:bg-secondary/80"
                variant="secondary"
                onClick={() => handleFollowUpClick(question)}
              >
                {question}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
