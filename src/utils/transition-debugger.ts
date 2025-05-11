
/**
 * Utility to help debug transitions and identify race conditions
 */

// Enable or disable debug logging
const DEBUG_ENABLED = true;

// Stack to track transition operations
const transitionStack: string[] = [];

// Function to log transition events with timestamps
export function logTransition(source: string, action: string, data?: any): void {
  if (!DEBUG_ENABLED) return;
  
  const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
  const message = `[${timestamp}] ${source}: ${action}`;
  
  console.log(message, data ? data : '');
  
  // Track in stack
  transitionStack.push(message);
  
  // Keep stack at reasonable size
  if (transitionStack.length > 50) {
    transitionStack.shift();
  }
}

// Print the transition history to help debug issues
export function printTransitionHistory(): void {
  if (!DEBUG_ENABLED || transitionStack.length === 0) return;
  
  console.group('Transition History:');
  transitionStack.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry}`);
  });
  console.groupEnd();
}

// Clear the transition history
export function clearTransitionHistory(): void {
  transitionStack.length = 0;
}

export default {
  logTransition,
  printTransitionHistory,
  clearTransitionHistory
};
