
/**
 * Re-export the buildOpenAIPrompt function from the shared module
 * This maintains backward compatibility while using the centralized prompt definition
 */
export { buildOpenAIPrompt } from '../_shared/recipe-prompts.ts';
