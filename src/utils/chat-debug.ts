import { useUnifiedChatStore } from '@/store/unified-chat-store';

// Allow logs to be disabled in production
const IS_DEV = process.env.NODE_ENV === 'development';
const ENABLE_LOGS = IS_DEV || localStorage.getItem('enable_chat_debug') === 'true';

type LogLevel = 'log' | 'warn' | 'error' | 'info';
type DetailedLogObject = Record<string, any>;

/**
 * Helper function to debug chat state
 * This can be called from the browser console to inspect the current chat state
 */
export function debugChatState() {
  const state = useUnifiedChatStore.getState();
  
  console.group('🔄 Current Chat Store State');
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
  
  // @ts-ignore
  window.toggleChatDebug = () => {
    const current = localStorage.getItem('enable_chat_debug') === 'true';
    localStorage.setItem('enable_chat_debug', (!current).toString());
    console.log(`Chat debugging ${!current ? 'enabled' : 'disabled'}`);
    return !current;
  };
}

/**
 * Log chat-related events with standardized format and filtering
 */
export function logChatEvent(
  event: string,
  details: DetailedLogObject = {},
  level: LogLevel = 'log'
) {
  // Skip logging if disabled
  if (!ENABLE_LOGS && level !== 'error') return;
  
  // Add timestamp for better debugging
  const timestamp = new Date().toISOString();
  details.timestamp = timestamp;
  
  const logFn = level === 'error' ? console.error : 
                level === 'warn' ? console.warn :
                level === 'info' ? console.info :
                console.log;
  
  // Format prefix based on log level
  const emoji = level === 'error' ? '❌' : 
               level === 'warn' ? '⚠️' : 
               level === 'info' ? 'ℹ️' : 
               '💬';
  
  logFn(
    `%c${emoji} [CHAT] %c${event}`, 
    'color: #4CAF50; font-weight: bold', 
    'color: #2196F3',
    details
  );
  
  // Collect errors for analytics in the future
  if (level === 'error') {
    try {
      const errorEvents = JSON.parse(localStorage.getItem('chat_errors') || '[]');
      errorEvents.push({
        event,
        details,
        timestamp
      });
      // Keep only the last 20 errors
      if (errorEvents.length > 20) {
        errorEvents.shift();
      }
      localStorage.setItem('chat_errors', JSON.stringify(errorEvents));
    } catch (e) {
      // Silently ignore storage errors
    }
  }
}

/**
 * Get the last errors for debugging
 */
export function getRecentChatErrors() {
  try {
    return JSON.parse(localStorage.getItem('chat_errors') || '[]');
  } catch (e) {
    return [];
  }
}

/**
 * Clear error log
 */
export function clearChatErrors() {
  localStorage.removeItem('chat_errors');
  return true;
}

/**
 * Calculate some analytics about chat usage
 */
export function getChatAnalytics() {
  const state = useUnifiedChatStore.getState();
  const allMessages = Object.values(state.messages).flat();
  const optimisticCount = Object.values(state.optimisticMessages).reduce((acc, msgs) => acc + msgs.length, 0);
  const failedStates = Object.values(state.messageStates).filter(s => s.failed).length;
  
  return {
    totalMessages: allMessages.length,
    pendingMessages: optimisticCount,
    failedMessages: failedStates,
    appliedChanges: allMessages.filter(m => m.applied).length,
    activeRecipes: Object.keys(state.messages).length,
    quickRecipes: state.quickRecipeIds.size
  };
}
