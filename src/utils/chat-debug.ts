
import { useUnifiedChatStore } from '@/store/unified-chat-store';

/**
 * Helper function to debug chat state
 * This can be called from the browser console to inspect the current chat state
 */
export function debugChatState() {
  const state = useUnifiedChatStore.getState();
  
  console.group('Current Chat Store State');
  console.log('Messages by Recipe:', state.messages);
  console.log('Optimistic Messages:', state.optimisticMessages);
  console.log('Message States:', state.messageStates);
  console.log('Is Loading Messages:', state.isLoadingMessages);
  console.log('Quick Recipe IDs:', state.quickRecipeIds);
  console.groupEnd();
  
  return {
    messageCount: Object.values(state.messages).reduce((acc, msgs) => acc + msgs.length, 0),
    optimisticCount: Object.values(state.optimisticMessages).reduce((acc, msgs) => acc + msgs.length, 0),
    recipeCount: Object.keys(state.messages).length,
    quickRecipeCount: state.quickRecipeIds.size,
  };
}

/**
 * Expose the debug function to the global window object
 * for easy access from the browser console
 */
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.debugChatState = debugChatState;
}

/**
 * Log chat-related events with standardized format
 */
export function logChatEvent(
  event: string,
  details: Record<string, any>,
  level: 'log' | 'warn' | 'error' = 'log'
) {
  const logFn = level === 'error' ? console.error : 
                level === 'warn' ? console.warn : 
                console.log;
  
  logFn(
    `%c[CHAT] %c${event}`, 
    'color: #4CAF50; font-weight: bold', 
    'color: #2196F3',
    details
  );
}
