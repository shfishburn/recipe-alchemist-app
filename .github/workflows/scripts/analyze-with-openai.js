
const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Get the path to the diff file from environment variable
const diffFilePath = process.env.CHANGES_DIFF || './changes.diff';
const openaiApiKey = process.env.OPENAI_API_KEY;

async function analyzeCodeWithOpenAI() {
  try {
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
    
    // Truncate if too large (OpenAI has token limits)
    const maxLength = 8000; // Conservative limit to avoid token count issues
    const truncatedDiff = diffContent.length > maxLength 
      ? diffContent.substring(0, maxLength) + '\n\n[Diff truncated due to size limits]' 
      : diffContent;

    console.log(`Sending ${truncatedDiff.length} characters to OpenAI API`);
    
    // Prepare the OpenAI API request
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
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
  } catch (error) {
    console.error('Error generating OpenAI analysis:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data));
    }
    const errorMessage = 'Error generating AI analysis. Please check the workflow logs.';
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
