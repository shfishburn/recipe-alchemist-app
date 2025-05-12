import fs from 'node:fs';
import axios from 'axios';
import path from 'node:path';

// Get the path to the diff file from environment variable
const diffFilePath = process.env.CHANGES_DIFF || './changes.diff';
const openaiApiKey = process.env.OPENAI_API_KEY;

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
      console.error(`Diff file not found at path: ${diffFilePath}`);
      fs.writeFileSync('openai_analysis.txt', 'No diff file available for analysis.');
      return 'No diff file available for analysis.';
    }

    // Read the diff file
    const diffContent = fs.readFileSync(diffFilePath, 'utf8');

    // Check if diff content is empty
    if (!diffContent || diffContent.trim().length === 0) {
      console.log('Diff content is empty, no changes to analyze');
      fs.writeFileSync('openai_analysis.txt', 'No changes detected to analyze.');
      return 'No changes detected to analyze.';
    }

    // Log file size for debugging
    console.log(`Diff file size: ${diffContent.length} characters`);

    // Truncate if too large (OpenAI has token limits)
    const maxLength = 8000; // Conservative limit to avoid token count issues
    const truncatedDiff = diffContent.length > maxLength
      ? diffContent.substring(0, maxLength) + '\n\n[Diff truncated due to size limits]'
      : diffContent;

    console.log(`Sending ${truncatedDiff.length} characters to OpenAI API`);

    // Try with gpt-4o-mini first, fall back to gpt-3.5-turbo if needed
    let model = 'gpt-4o-mini';

    try {
      // Prepare the OpenAI API request
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: model,
        messages: [
          {
            role: 'system',
            content: `You are a code review assistant analyzing git diffs. Provide a concise, helpful analysis that includes:

            1. Summary of the overall changes
            2. Potential issues or bugs
            3. Security concerns if any
            4. Suggestions for improvement
            5. Code quality observations

            Focus on providing actionable insights without being overly verbose.`
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

      // Extract the analysis from the response
      const analysis = response.data.choices[0].message.content;

      // Save the analysis to a file
      fs.writeFileSync('openai_analysis.txt', analysis);

      // Output for GitHub Actions
      console.log('OpenAI analysis generated successfully');

      return analysis;
    } catch (apiError) {
      // If the error is related to the model not being available, try with gpt-3.5-turbo
      if (apiError.response &&
          (apiError.response.status === 404 ||
           (apiError.response.data && apiError.response.data.error &&
            apiError.response.data.error.message &&
            apiError.response.data.error.message.includes('model')))) {

        console.log('Falling back to gpt-3.5-turbo model...');
        model = 'gpt-3.5-turbo';

        const fallbackResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: model,
          messages: [
            {
              role: 'system',
              content: `You are a code review assistant analyzing git diffs. Provide a concise, helpful analysis that includes:

              1. Summary of the overall changes
              2. Potential issues or bugs
              3. Security concerns if any
              4. Suggestions for improvement
              5. Code quality observations

              Focus on providing actionable insights without being overly verbose.`
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

        const fallbackAnalysis = fallbackResponse.data.choices[0].message.content;
        fs.writeFileSync('openai_analysis.txt', fallbackAnalysis);
        console.log('OpenAI analysis generated successfully with fallback model');
        return fallbackAnalysis;
      } else {
        // Re-throw if it's not a model-related error
        throw apiError;
      }
    }
  } catch (error) {
    console.error('Error generating OpenAI analysis:', error.message);
    let errorDetails = 'Error details: ';

    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data));
      errorDetails += `Status: ${error.response.status}, `;
      if (error.response.data && error.response.data.error) {
        errorDetails += `Message: ${error.response.data.error.message}`;
      }
    } else if (error.request) {
      console.error('No response received from OpenAI API');
      errorDetails += 'No response received from OpenAI API. Check your network connection.';
    } else {
      errorDetails += error.message;
    }

    const errorMessage = `Error generating AI analysis. ${errorDetails}`;
    fs.writeFileSync('openai_analysis.txt', errorMessage);
    return errorMessage;
  }
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
