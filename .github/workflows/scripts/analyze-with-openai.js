import fs from 'node:fs';
import axios from 'axios';
import path from 'node:path';

// Get the path to the diff file from environment variable
const diffFilePath = process.env.CHANGES_DIFF || './changes.diff';
const openaiApiKey = process.env.OPENAI_API_KEY;

// Constants for API request configuration
const MIN_DIFF_LENGTH = 10; // Minimum characters required to perform analysis
const MAX_DIFF_LENGTH = 8000; // Maximum diff length to send to OpenAI API
const MAX_RETRIES = 2; // Number of retries for API calls

/**
 * Analyzes code changes using OpenAI's API and generates a code review
 * @returns {Promise<string>} The analysis result or error message
 */
async function analyzeCodeWithOpenAI() {
  try {
    // Validate OpenAI API key
    if (!openaiApiKey) {
      const errorMessage = 'OpenAI API Key is not provided. Please add OPENAI_API_KEY to your repository secrets.';
      console.error(errorMessage);
      fs.writeFileSync('openai_analysis.txt', errorMessage);
      return errorMessage;
    }

    // Check if diff file exists
    if (!fs.existsSync(diffFilePath)) {
      const errorMessage = `Diff file not found at path: ${diffFilePath}`;
      console.error(errorMessage);
      fs.writeFileSync('openai_analysis.txt', 'No diff file available for analysis.');
      return 'No diff file available for analysis.';
    }

    // Read the diff file
    const diffContent = fs.readFileSync(diffFilePath, 'utf8');

    // Validate diff content
    if (!diffContent || diffContent.trim().length < MIN_DIFF_LENGTH) {
      const errorMessage = 'Diff content is too small or empty, no meaningful changes to analyze';
      console.log(errorMessage);
      fs.writeFileSync('openai_analysis.txt', 'No significant changes detected to analyze.');
      return 'No significant changes detected to analyze.';
    }

    // Log file size for debugging
    console.log(`Diff file size: ${diffContent.length} characters`);

    // Truncate if too large (OpenAI has token limits)
    const truncatedDiff = diffContent.length > MAX_DIFF_LENGTH
      ? diffContent.substring(0, MAX_DIFF_LENGTH) + '\n\n[Diff truncated due to size limits]'
      : diffContent;

    console.log(`Sending ${truncatedDiff.length} characters to OpenAI API`);

    // Define system prompt with clear description of its purpose
    const systemPrompt = `You are a code review assistant analyzing git diffs. Provide a concise, helpful analysis that includes:

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

    // Try with gpt-4o-mini first, fall back to gpt-3.5-turbo if needed
    return await makeApiRequestWithFallback(systemPrompt, truncatedDiff);

  } catch (error) {
    // Central error handler for any unexpected exceptions
    const errorDetails = formatErrorDetails(error);
    const errorMessage = `Unexpected error in code analysis: ${errorDetails}`;
    console.error(errorMessage);
    fs.writeFileSync('openai_analysis.txt', errorMessage);
    return errorMessage;
  }
}

/**
 * Makes API request to OpenAI with fallback to a different model if the first fails
 * @param {string} systemPrompt - The system prompt for the AI
 * @param {string} truncatedDiff - The diff content to analyze
 * @returns {Promise<string>} The analysis text
 */
async function makeApiRequestWithFallback(systemPrompt, truncatedDiff) {
  // Models to try in order of preference
  const models = ['gpt-4o-mini', 'gpt-3.5-turbo'];
  let lastError = null;
  
  for (const model of models) {
    try {
      console.log(`Attempting analysis with ${model} model...`);
      const analysis = await makeOpenAiRequest(model, systemPrompt, truncatedDiff);
      
      // Save the analysis to a file
      fs.writeFileSync('openai_analysis.txt', analysis);
      console.log(`OpenAI analysis generated successfully with ${model}`);
      return analysis;
    } catch (error) {
      lastError = error;
      
      // Only retry with fallback model if the error is related to the model
      const shouldTryFallback = isModelRelatedError(error);
      if (!shouldTryFallback) {
        throw error; // Re-throw if not a model-related error
      }
      
      console.log(`Error with ${model}, will try fallback model if available...`);
    }
  }
  
  // If we've exhausted all models, throw the last error
  throw lastError || new Error('Failed to generate analysis with all available models');
}

/**
 * Makes a request to the OpenAI API
 * @param {string} model - The OpenAI model to use
 * @param {string} systemPrompt - The system prompt for the AI
 * @param {string} truncatedDiff - The diff content to analyze
 * @returns {Promise<string>} The generated text
 */
async function makeOpenAiRequest(model, systemPrompt, truncatedDiff) {
  // Implement retry logic
  let retryCount = 0;
  let lastError = null;

  while (retryCount <= MAX_RETRIES) {
    try {
      if (retryCount > 0) {
        console.log(`Retry attempt ${retryCount} for ${model}...`);
        // Small delay between retries to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
      }

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Analyze this git diff and provide a code review:\n\n${truncatedDiff}`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      }, {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      // Check if the response has the expected structure
      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error('Unexpected response structure from OpenAI API');
      }

      return response.data.choices[0].message.content;
    } catch (error) {
      lastError = error;
      retryCount++;
      
      // If it's not a temporary error (e.g. 429, 500), don't retry
      if (!isRetryableError(error)) {
        break;
      }
    }
  }

  throw lastError || new Error('Failed to complete API request after retries');
}

/**
 * Determines if an error is related to model availability
 * @param {Error} error - The error to check
 * @returns {boolean} True if it's a model-related error
 */
function isModelRelatedError(error) {
  return error.response &&
    (error.response.status === 404 ||
     (error.response.data && 
      error.response.data.error &&
      error.response.data.error.message &&
      error.response.data.error.message.includes('model')));
}

/**
 * Determines if an error should be retried
 * @param {Error} error - The error to check
 * @returns {boolean} True if the error is temporary and should be retried
 */
function isRetryableError(error) {
  // Retry on rate limiting and server errors
  return error.response && 
    (error.response.status === 429 || 
     (error.response.status >= 500 && error.response.status < 600));
}

/**
 * Formats error details for logging and user feedback
 * @param {Error} error - The error to format
 * @returns {string} Formatted error details
 */
function formatErrorDetails(error) {
  let errorDetails = 'Error details: ';

  if (error.response) {
    errorDetails += `Status: ${error.response.status}, `;
    if (error.response.data && error.response.data.error) {
      errorDetails += `Message: ${error.response.data.error.message}`;
    }
  } else if (error.request) {
    errorDetails += 'No response received from OpenAI API. Check your network connection.';
  } else {
    errorDetails += error.message;
  }

  return errorDetails;
}

// Run the analysis
analyzeCodeWithOpenAI()
  .then(result => {
    console.log('Analysis completed');
  })
  .catch(err => {
    console.error('Uncaught error in analysis:', err);
    process.exit(1);
  });
