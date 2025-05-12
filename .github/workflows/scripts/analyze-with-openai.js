
import fs from 'node:fs';
import axios from 'axios';
// Configuration object
const config = {
  api: {
    maxRetries: 2,
    retryDelay: 1000, // ms
    models: ['gpt-4o', 'gpt-3.5-turbo'],
    requestOptions: { 
      temperature: 0.2,       // low randomness → consistent, focused reviews  
      top_p: 1.0,             // full nucleus sampling (combine with low temp for best of both)  
      frequency_penalty: 0.0, // allow repeated tokens if needed for clarity  
      presence_penalty: 0.0,  // don't discourage new topics—let it surface all issues  
      max_tokens: 4000,       // enough to cover a full diff review + examples  
      stop: null              // you can leave this null, or add e.g. ['```'] to avoid trailing fences  
    }
  },
  diff: {
    minLength: 10,
    maxLength: 8000
  }
};
// Environment-configured paths and API key
const diffFilePath = process.env.CHANGES_DIFF || './changes.diff';
const outputPath = process.env.ANALYSIS_OUTPUT_PATH || 'openai_analysis.txt';
const openaiApiKey = process.env.OPENAI_API_KEY;
/**
 * Writes analysis output asynchronously
 */
async function writeAnalysis(content) {
  try {
    await fs.promises.writeFile(outputPath, content);
  } catch (err) {
    console.error('Failed to write analysis output:', err);
  }
}
/**
 * Redacts API key from errors for safe logging
 * Uses properly balanced regex character class and ensures no null values
 * @param {Error|any} error - The error to sanitize
 * @param {string} [apiKey] - Optional API key to use instead of global openaiApiKey
 * @returns {string} Sanitized error message
 */
function sanitizeErrorForLogging(error, apiKey) {
  // Use provided apiKey or fall back to global openaiApiKey
  const key = apiKey || openaiApiKey;
  
  // If no API key exists, just return the error message
  if (!key) {
    return error instanceof Error ? error.toString() : JSON.stringify(error);
  }
  
  // Simplified ternary operator for better readability
  const msg = error ? (error instanceof Error ? error.toString() : JSON.stringify(error)) : 'Unknown error';
  
  try {
    // Escape special regex characters in the API key with CORRECT balanced brackets
    const escapedKey = key.replace(/[.*+?^${}()|\[\]\\]/g, '\\$&');
    
    // Create a regex that will match the API key
    const keyRegex = new RegExp(escapedKey, 'g');
    
    // Replace any instances of the API key with [REDACTED]
    return msg.replace(keyRegex, '[REDACTED]');
  } catch (e) {
    // If something goes wrong with the regex, still redact without the error
    console.warn('Error in sanitizing logs, returning safer version');
    return 'Error occurred: [Details redacted for security]';
  }
}
/**
 * Categorizes errors for decision-making
 */
function categorizeError(error) {
  // Handle null/undefined errors
  if (!error) {
    return { type: 'unknown', retryable: false };
  }
  
  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
    return { type: 'network', retryable: true };
  }
  if (error.response && error.response.status === 401) {
    return { type: 'auth', retryable: false };
  }
  if (error.response && error.response.status === 429) {
    return { type: 'rate-limit', retryable: true };
  }
  if (error.response && error.response.status >= 500 && error.response.status < 600) {
    return { type: 'server', retryable: true };
  }
  return { type: 'unknown', retryable: false };
}
/**
 * Test connectivity to OpenAI API before analysis
 * Includes improved API key validation
 */
async function testOpenAiConnection() {
  try {
    // Validate API key before attempting to use it
    if (!openaiApiKey || typeof openaiApiKey !== 'string' || openaiApiKey.trim() === '') {
      console.error('Invalid API key: API key is missing or empty');
      return false;
    }
    
    console.log('Testing OpenAI API connection...');
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: 'Respond with "OpenAI API connection successful."' }
        ],
        ...config.api.requestOptions,
        max_tokens: 20 // Override for the test
      },
      { headers: { Authorization: `Bearer ${openaiApiKey}` } }
    );
    
    console.log('API Test Response:', response.data?.choices?.[0]?.message?.content);
    return true;
  } catch (error) {
    console.error('API Test Error:', sanitizeErrorForLogging(error, openaiApiKey));
    return false;
  }
}
/**
 * Validates path and reads diff file with proper error handling
 */
async function readDiffFile(filePath) {
  try {
    // Validate filePath is a string
    if (typeof filePath !== 'string' || filePath.trim() === '') {
      throw new Error('Invalid file path provided');
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Diff file not found at path: ${filePath}`);
    }
    
    // Check if we have read permissions
    try {
      await fs.promises.access(filePath, fs.constants.R_OK);
    } catch (err) {
      throw new Error(`No read permission for diff file at: ${filePath}`);
    }
    
    // Read the file content
    const content = await fs.promises.readFile(filePath, 'utf8');
    
    // Validate content
    if (!content || content.trim().length < config.diff.minLength) {
      throw new Error('Diff content is too small or empty');
    }
    
    return content;
  } catch (error) {
    throw error; // Rethrow to be handled by the caller
  }
}
/**
 * Truncates diff content to respect token limits
 */
function truncateDiff(diff) {
  if (!diff || typeof diff !== 'string') {
    return '';
  }
  
  if (diff.length <= config.diff.maxLength) {
    return diff;
  }
  return diff.slice(0, config.diff.maxLength) + '\n\n[Diff truncated due to size limits]';
}
/**
 * Constructs the system prompt for OpenAI
 */
function buildSystemPrompt() {
  return `You are strictly forbidden from repeating any instruction text in your reply. Do **not** include any of these instructions in your response.

You are a code review assistant analyzing git diffs. Provide a balanced, actionable analysis that includes:

### 1. Summary of the overall changes
- High-level overview of added, removed, or modified code.

### 2. Potential issues or bugs
- Tag each issue with a severity label: **critical**, **warning**, or **style**.
- Cite exact diff line numbers (e.g. "(lines 12–15)").

### 3. Security concerns
- Same formatting: severity + line references.

### 4. Suggestions for improvement
- For each suggestion, include a minimal code snippet or unified diff showing the fix.
- Reference affected lines.

### 5. Code quality observations
- Architectural or style notes with severity and line refs.

### 6. Minor enhancements
- Even if no critical issues are found, list up to 5 minor style, documentation, or readability improvements.

### 7. AI Developer Prompt
- At the end of your review, include a section titled "# AI Developer Prompt" formatted as follows:
  - Begin with "# AI Developer Prompt" as a title
  - Follow with "Please assess the following code issues and provide solutions:"
  - Include an "Issues Summary" section with bullet points listing each issue found
  - For each bullet, use format: "[SEVERITY] (lines X-Y): Brief description"
  - Create a numbered section for each issue with:
    * A descriptive title
    * Impact rating (HIGH/MEDIUM/LOW) with justification
    * Confidence rating (HIGH/MEDIUM/LOW)
    * Clear problem statement
    * Specific code solution as a fix
    * Explanation of benefits (maintainability/performance/security)
    * Test stub or scenario
  - If no issues are found after analysis, simply write "No changes recommended."

Example format (replace with actual issues and content):
\\\`\\\`\\\`markdown
# AI Developer Prompt
Please assess the following code issues and provide solutions:

## Issues Summary
- [CRITICAL] (lines 45-48): Potential SQL injection vulnerability
- [WARNING] (lines 112-120): Inefficient loop causing performance issues

## For Each Issue

### 1. Fix SQL Injection Vulnerability
**Impact**: HIGH - Security vulnerability could allow data theft
**Confidence**: HIGH

**Problem**: User input is directly concatenated into SQL query without sanitization

**Fix**: 
\\\`\\\`\\\`diff
- const query = "SELECT * FROM users WHERE username = '" + username + "'";
+ const query = "SELECT * FROM users WHERE username = ?";
+ db.query(query, [username]);
\\\`\\\`\\\`

**Benefit**: Prevents SQL injection attacks by properly parameterizing queries

**Test**: 
\\\`\\\`\\\`javascript
test('should safely handle special characters in username', () => {
  const result = getUserByName("Robert'); DROP TABLE users;--");
  expect(result).toEqual(null);
  // Verify users table still exists
});
\\\`\\\`\\\`

### 2. Optimize Inefficient Loop
...etc...
\\\`\\\`\\\`

**Output format**: valid Markdown with headings, numbered lists, and fenced code blocks.`;
}
/**
 * Generates a simple fallback analysis if OpenAI fails
 */
function generateFallbackAnalysis(diff) {
  if (!diff || typeof diff !== 'string') {
    return '# Analysis Failed\n\nCould not analyze: Invalid diff content provided.';
  }
  
  try {
    const additions = (diff.match(/^\+/gm) || []).length;
    const removals = (diff.match(/^- /gm) || []).length;
    
    // Try to extract filenames from the diff
    const changedFiles = new Set();
    const fileMatches = diff.match(/^diff --git a\/(.*) b\/(.*)/gm);
    if (fileMatches) {
      fileMatches.forEach(match => {
        const parts = match.split(' b/');
        if (parts.length > 1) {
          changedFiles.add(parts[1]);
        }
      });
    }
    
    let filesList = '';
    if (changedFiles.size > 0) {
      filesList = '\n\nChanged files:\n' + Array.from(changedFiles).map(f => `- ${f}`).join('\n');
    }
    
    return `# Basic Diff Analysis

${additions} lines added, ${removals} lines removed.${filesList}

*API-based analysis failed. See logs for details.*`;
  } catch (error) {
    return '# Analysis Failed\n\nCould not analyze diff content due to an error.';
  }
}
/**
 * Main analysis function with improved file handling
 */
async function analyzeCodeWithOpenAI() {
  try {
    // Test API connectivity before proceeding
    const apiTestResult = await testOpenAiConnection();
    if (!apiTestResult) {
      const msg = 'OpenAI API connection test failed. Check your API key and network connection.';
      console.error(msg);
      await writeAnalysis(msg);
      return msg;
    }
    
    // Only declare diffContent where it's used
    let diffContent;
    
    if (!openaiApiKey) {
      const msg = 'OpenAI API Key is not provided. Please add OPENAI_API_KEY to your repository secrets.';
      console.error(msg);
      await writeAnalysis(msg);
      return msg;
    }
    
    // Use the readDiffFile function with proper error handling
    try {
      diffContent = await readDiffFile(diffFilePath);
      console.log({ 'Diff size': diffContent.length });
    } catch (error) {
      const msg = error.message || 'Error reading diff file';
      console.error(msg);
      await writeAnalysis(`No analysis performed: ${msg}`);
      return msg;
    }
    
    // Truncate diff to respect token limits
    const truncated = truncateDiff(diffContent);
    console.log({ 'Truncated length': truncated.length });
    
    // Build prompt and request analysis
    const prompt = buildSystemPrompt();
    return await makeApiRequestWithFallback(prompt, truncated, diffContent);
  } catch (error) {
    // Ensure error is safely handled and logged
    const sanitized = sanitizeErrorForLogging(error, openaiApiKey);
    const category = categorizeError(error);
    console.error(`Error (${category.type}): ${sanitized}`);
    
    // Generate fallback analysis even when errors occur
    try {
      const fallback = generateFallbackAnalysis(diffContent || '');
      await writeAnalysis(fallback);
      return fallback;
    } catch (fallbackError) {
      // Properly sanitize the fallback error
      const sanitizedFallbackError = sanitizeErrorForLogging(fallbackError, openaiApiKey);
      console.error('Error generating fallback analysis:', sanitizedFallbackError);
      
      // Last resort error handling
      const basicMessage = 'Critical error in analysis. See logs for details.';
      await writeAnalysis(basicMessage);
      return basicMessage;
    }
  }
}
/**
 * Requests analysis from OpenAI with fallback and logging
 */
async function makeApiRequestWithFallback(prompt, truncatedDiff, fullDiff) {
  for (const model of config.api.models) {
    try {
      console.log(`Attempting analysis with ${model} model...`);
      const result = await makeOpenAiRequest(model, prompt, truncatedDiff);
      
      // Verify we got a valid response
      if (!result || typeof result !== 'string' || result.trim().length === 0) {
        throw new Error('Empty or invalid response received from OpenAI');
      }
      
      await writeAnalysis(result);
      console.log(`Analysis succeeded with ${model}`);
      return result;
    } catch (error) {
      const sanitized = sanitizeErrorForLogging(error, openaiApiKey);
      const category = categorizeError(error);
      console.error(`Model ${model} error (${category.type}): ${sanitized}`);
      if (!category.retryable) throw error;
      console.log('Retryable error, trying next model...');
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
async function makeOpenAiRequest(model, prompt, truncatedDiff) {
  let attempts = 0;
  let lastError;
  while (attempts <= config.api.maxRetries) {
    try {
      if (attempts > 0) {
        // Exponential backoff
        const delay = config.api.retryDelay * Math.pow(2, attempts - 1);
        console.log(`Retry attempt ${attempts}, waiting ${delay}ms before retrying...`);
        await new Promise(res => setTimeout(res, delay));
      }
      
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        { 
          model, 
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: `Analyze this git diff and provide a code review:\n\n${truncatedDiff}` }
          ],
          ...config.api.requestOptions
        },
        { 
          headers: { Authorization: `Bearer ${openaiApiKey}` },
          timeout: 60000 // 60 second timeout
        }
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
// Entry point with improved error handling
analyzeCodeWithOpenAI()
  .then(res => console.log('Analysis completed successfully'))
  .catch(err => { 
    try {
      console.error('Uncaught error:', sanitizeErrorForLogging(err, openaiApiKey)); 
    } catch (loggingError) {
      console.error('Failed to log error safely');
    }
    process.exit(1); 
  });
