import fs from 'node:fs';
import axios from 'axios';

// Configuration object
const config = {
  api: {
    maxRetries: 2,
    retryDelay: 1000, // ms
    models: ['gpt-4o-mini', 'gpt-3.5-turbo']
  },
  diff: {
    minLength: 10,
    maxLength: 8000
  }
};

// Environment-configured paths and API key
type Env = string | undefined;
const diffFilePath: Env = process.env.CHANGES_DIFF ?? './changes.diff';
const outputPath: Env = process.env.ANALYSIS_OUTPUT_PATH ?? 'openai_analysis.txt';
const openaiApiKey: Env = process.env.OPENAI_API_KEY;

/**
 * Truncates diff content to respect token limits
 */
function truncateDiff(diff: string): string {
  return diff.length <= config.diff.maxLength
    ? diff
    : diff.slice(0, config.diff.maxLength) + '\n\n[Diff truncated due to size limits]';
}

/**
 * Constructs the system prompt for OpenAI
 */
function buildSystemPrompt(): string {
  return `You are a code review assistant analyzing git diffs. Provide a concise, helpful analysis that includes:

### 1. Summary of the overall changes
- A high-level overview of what's been added, removed, or modified.

### 2. Potential issues or bugs
- Tag each issue with a severity label: **critical**, **warning**, or **style**.
- Cite exact diff line numbers for each (e.g. “(lines 12–15)”).

### 3. Security concerns if any
- Same formatting: severity + line-number references.

### 4. Suggestions for improvement
- For each suggestion, include a minimal code snippet showing the fix.
- Reference the affected lines.

### 5. Code quality observations
- Style, formatting, or architectural notes with severity labels and line refs.

### 6. AI Developer Prompt
- Provide a copy-and-paste prompt that:
  1. First assesses whether any code smells or anti-patterns exist; if none are found, respond with **"No changes recommended."**
  2. Only proposes a change if it can cite a concrete benefit (e.g., reduces cyclomatic complexity, closes a security gap).
  3. Includes a brief justification of why each change improves maintainability, performance, or security.
  4. Requests or generates minimal code snippets or a unified diff for each fix.
  5. Requests corresponding unit-test stubs or test scenarios (mentioning the test framework) for each change.
  6. Rates each suggestion's impact and confidence on a simple scale.
- Ensure suggestions map to actionable improvements, not generic advice.
- Reference your project's style guide or coding standards for any style-rule violations.
- End with **"No changes recommended"** if no issues are detected.

**Output format** must be valid Markdown with headings, numbered lists, and fenced code blocks.`;
}

/**
 * Writes analysis output asynchronously
 */
async function writeAnalysis(content: string): Promise<void> {
  await fs.promises.writeFile(outputPath as string, content);
}

/**
 * Redacts API key from errors for safe logging
 */
function sanitizeErrorForLogging(error: any): string {
  const msg = error instanceof Error ? error.toString() : JSON.stringify(error);
  return openaiApiKey
    ? msg.replace(new RegExp(openaiApiKey, 'g'), '[REDACTED]')
    : msg;
}

/**
 * Categorizes errors for decision-making
 */
function categorizeError(error: any): { type: string; retryable: boolean } {
  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
    return { type: 'network', retryable: true };
  }
  if (error.response?.status === 401) {
    return { type: 'auth', retryable: false };
  }
  return { type: 'unknown', retryable: false };
}

/**
 * Generates a simple fallback analysis if OpenAI fails
 */
function generateFallbackAnalysis(diff: string): string {
  const additions = (diff.match(/^\+/gm) || []).length;
  const removals = (diff.match(/^- /gm) || []).length;
  return `# Basic Diff Analysis

${additions} lines added, ${removals} lines removed.

*API-based analysis failed.*`;
}

/**
 * Main analysis function
 */
async function analyzeCodeWithOpenAI(): Promise<string> {
  let diffContent = '';
  try {
    if (!openaiApiKey) {
      const msg = 'OpenAI API Key is not provided. Please add OPENAI_API_KEY to your repository secrets.';
      console.error(msg);
      await writeAnalysis(msg);
      return msg;
    }

    if (!fs.existsSync(diffFilePath as string)) {
      const msg = `Diff file not found at path: ${diffFilePath}`;
      console.error(msg);
      await writeAnalysis('No diff file available for analysis.');
      return 'No diff file available for analysis.';
    }

    diffContent = await fs.promises.readFile(diffFilePath as string, 'utf8');
    if (!diffContent || diffContent.trim().length < config.diff.minLength) {
      const msg = 'Diff content is too small or empty, no meaningful changes to analyze';
      console.log(msg);
      await writeAnalysis('No significant changes detected to analyze.');
      return 'No significant changes detected to analyze.';
    }

    console.log(`Diff file size: ${diffContent.length} characters`);
    const truncated = truncateDiff(diffContent);
    console.log(`Sending ${truncated.length} characters to OpenAI API`);

    const prompt = buildSystemPrompt();
    return await makeApiRequestWithFallback(prompt, truncated, diffContent);

  } catch (error) {
    const sanitized = sanitizeErrorForLogging(error);
    const category = categorizeError(error);
    console.error(`Error (${category.type}): ${sanitized}`);
    const fallback = generateFallbackAnalysis(diffContent);
    await writeAnalysis(fallback);
    return fallback;
  }
}

/**
 * Requests analysis from OpenAI with fallback and logging
 */
async function makeApiRequestWithFallback(
  prompt: string,
  truncatedDiff: string,
  fullDiff: string
): Promise<string> {
  for (const model of config.api.models) {
    try {
      console.log(`Attempting analysis with ${model} model...`);
      const result = await makeOpenAiRequest(model, prompt, truncatedDiff);
      await writeAnalysis(result);
      console.log(`Analysis succeeded with ${model}`);
      return result;
    } catch (error) {
      const sanitized = sanitizeErrorForLogging(error);
      const category = categorizeError(error);
      console.error(`Model ${model} error (${category.type}): ${sanitized}`);
      if (!category.retryable) throw error;
      console.log(`Retryable error, trying next model...`);
    }
  }

  console.warn('All models failed, generating fallback analysis.');
  const fallback = generateFallbackAnalysis(fullDiff);
  await writeAnalysis(fallback);
  return fallback;
}

/**
 * Sends the chat completion request to OpenAI
 */
async function makeOpenAiRequest(
  model: string,
  prompt: string,
  truncatedDiff: string
): Promise<string> {
  let attempts = 0;
  let lastError: any;

  while (attempts <= config.api.maxRetries) {
    try {
      if (attempts > 0) {
        await new Promise(res => setTimeout(res, config.api.retryDelay));
      }
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model,
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: `Analyze this git diff and provide a code review:\n\n${truncatedDiff}` }
          ],
          temperature: 0.3,
          max_tokens: 2000
        },
        { headers: { Authorization: `Bearer ${openaiApiKey}` } }
      );

      const content = response.data?.choices?.[0]?.message?.content;
      if (!content) throw new Error('Unexpected response structure from OpenAI API');
      return content;
    } catch (error) {
      lastError = error;
      if (!categorizeError(error).retryable) break;
      attempts++;
    }
  }

  throw lastError;
}

// Entry point
analyzeCodeWithOpenAI()
  .then(res => console.log('Analysis completed:', res))
  .catch(err => { console.error('Uncaught error:', sanitizeErrorForLogging(err)); process.exit(1); });
