
import { useState, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import { highlightText } from '../utils/text-highlighter';
import DOMPurify from 'dompurify';

export function useResponseFormatter(message: ChatMessage) {
  const [formattedContent, setFormattedContent] = useState<string>(message.content);
  
  useEffect(() => {
    if (!message.content) {
      setFormattedContent('');
      return;
    }

    try {
      // Apply highlighting based on changes_suggested
      let highlighted = message.content;
      
      if (message.changes_suggested) {
        highlighted = highlightText(message.content, message.changes_suggested);
      }
      
      // Sanitize HTML to prevent XSS
      const sanitized = DOMPurify.sanitize(highlighted, {
        ALLOWED_TAGS: ['mark', 'p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'code'],
        ALLOWED_ATTR: ['class']
      });
      
      setFormattedContent(sanitized);
    } catch (error) {
      console.error('Error formatting response:', error);
      setFormattedContent(message.content);
    }
  }, [message]);

  return formattedContent;
}
