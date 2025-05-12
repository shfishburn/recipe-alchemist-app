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
 * Uses properly balanced regex character class
 */
function sanitizeErrorForLogging(error) {
  const msg = error instanceof Error ? error.toString() : JSON.stringify(error);
  const key = openaiApiKey ? openaiApiKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : null;
  return key ? msg.replace(new RegExp(key, 'g'), '[REDACTED]') : msg;
}

/**
 * Categorizes errors for decision-making
 */
function categorizeError(error) {
  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
    return { type: 'network', retryable: true };
  }
  if (error.response && error.response.status === 401) {
    return { type: 'auth', retryable: false };
  }
  return { type: 'unknown', retryable: false };
}

/**
 * Test connectivity to OpenAI API before analysis
 */
async function testOpenAiConnection() {
  try {
    console.log('Testing OpenAI API connection...');
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: 'Respond with "OpenAI API connection successful."' }
        ],
        temperature: 0.3,
        max_tokens: 20
      },
      { headers: { Authorization: `Bearer ${openaiApiKey}` } }
    );
    console.log('API Test Response:', response.data?.choices?.[0]?.message?.content);
    return true;
  } catch (error) {
    console.error('API Test Error:', sanitizeErrorForLogging(error));
    return false;
  }
}

/**
 * Truncates diff content to respect token limits
 */
function truncateDiff(diff) {
  if (diff.length <= config.diff.maxLength) {
    return diff;
  }
  return diff.slice(0, config.diff.maxLength) + '\n\n[Diff truncated due to size limits]';
}

/**
 * Constructs the system prompt for OpenAI
 */
function buildSystemPrompt() {
  return `Do NOT include the prompt text itself in your response—only return the analysis sections described.

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
\`\`\`markdown
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
\`\`\`diff
- const query = "SELECT * FROM users WHERE username = '" + username + "'";
+ const query = "SELECT * FROM users WHERE username = ?";
+ db.query(query, [username]);
\`\`\`

**Benefit**: Prevents SQL injection attacks by properly parameterizing queries

**Test**: 
\`\`\`javascript
test('should safely handle special characters in username', () => {
  const result = getUserByName("Robert'); DROP TABLE users;--");
  expect(result).toEqual(null);
  // Verify users table still exists
});
\`\`\`

### 2. Optimize Inefficient Loop
...etc...
\`\`\`

**Output format**: valid Markdown with headings, numbered lists, and fenced code blocks.`;
}

/**
 * Generates a simple fallback analysis if OpenAI fails
 */
function generateFallbackAnalysis(diff) {
  const additions = (diff.match(/^\+/gm) || []).length;
  const removals = (diff.match(/^- /gm) || []).length;
  return `# Basic Diff Analysis

${additions} lines added, ${removals} lines removed.

*API-based analysis failed.*`;
}

/**
 * Main analysis function
 */
async function analyzeCodeWithOpenAI() {
  // Test API connectivity before proceeding
  const apiTestResult = await testOpenAiConnection();
  if (!apiTestResult) {
    const msg = 'OpenAI API connection test failed. Check your API key and network connection.';
    console.error(msg);
    await writeAnalysis(msg);
    return msg;
  }

  let diffContent = '';
  try {
    if (!openaiApiKey) {
      const msg = 'OpenAI API Key is not provided. Please add OPENAI_API_KEY to your repository secrets.';
      console.error(msg);
      await writeAnalysis(msg);
      return msg;
    }

    if (!fs.existsSync(diffFilePath)) {
      const msg = `Diff file not found at path: ${diffFilePath}`;
      console.error(msg);
      await writeAnalysis('No diff file available for analysis.');
      return 'No diff file available for analysis.';
    }

    diffContent = await fs.promises.readFile(diffFilePath, 'utf8');
    if (!diffContent || diffContent.trim().length < config.diff.minLength) {
      const msg = 'Diff content is too small or empty, no meaningful changes to analyze';
      console.log(msg);
      await writeAnalysis('No significant changes detected to analyze.');
      return 'No significant changes detected to analyze.';
    }

    console.log({ 'Diff size': diffContent.length });
    const truncated = truncateDiff(diffContent);
    console.log({ 'Truncated length': truncated.length });

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
async function makeApiRequestWithFallback(prompt, truncatedDiff, fullDiff) {
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
      if (attempts > 0) await new Promise(res => setTimeout(res, config.api.retryDelay));
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        { model, messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: `Analyze this git diff and provide a code review:\n\n${truncatedDiff}` }
          ], temperature: 0.3, max_tokens: 2000
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
