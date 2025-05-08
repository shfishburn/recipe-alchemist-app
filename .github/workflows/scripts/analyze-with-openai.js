
const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Get the path to the diff file from environment variable
const diffFilePath = process.env.CHANGES_DIFF || './changes.diff';
const openaiApiKey = process.env.OPENAI_API_KEY;

async function analyzeCodeWithOpenAI() {
  try {
    // Read the diff file
    const diffContent = fs.readFileSync(diffFilePath, 'utf8');
    
    // Truncate if too large (OpenAI has token limits)
    const maxLength = 8000; // Conservative limit to avoid token count issues
    const truncatedDiff = diffContent.length > maxLength 
      ? diffContent.substring(0, maxLength) + '\n\n[Diff truncated due to size limits]' 
      : diffContent;

    // Prepare the OpenAI API request
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o',
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
    console.log(`::set-output name=analysis::${analysis.substring(0, 1000)}...`); // Truncated for GitHub Actions output
    
    return analysis;
  } catch (error) {
    console.error('Error generating OpenAI analysis:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    fs.writeFileSync('openai_analysis.txt', 'Error generating AI analysis. Please check the workflow logs.');
    return 'Error generating AI analysis. Please check the workflow logs.';
  }
}

// Run the analysis
analyzeCodeWithOpenAI();
