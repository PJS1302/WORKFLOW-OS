// AI Service integrating Google Gemini AI
const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Invalid response from Gemini API');
  }
  return text.trim();
};

exports.summarizeRequest = async (title, description) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.log('[AI SIMULATED] Summarizing request (GEMINI_API_KEY not configured)...');
      return `AI Summary (Simulated): This request "${title}" covers: "${description.substring(0, 80)}..."`;
    }
    const prompt = `You are an executive assistant. Summarize the following business request in 2 concise sentences or bullet points. Avoid preamble.
Title: ${title}
Description: ${description}`;
    
    return await callGemini(prompt);
  } catch (error) {
    console.error('Gemini Summarization error:', error.message);
    return `AI Summary (Fallback): Request "${title}" is submitted. Details: ${description.substring(0, 55)}...`;
  }
};

exports.recommendImprovement = async (workflowType) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.log('[AI SIMULATED] Recommending improvement (GEMINI_API_KEY not configured)...');
      return `AI Recommendation (Simulated): For the "${workflowType}" workflow, consider adding a preliminary review step to filter incomplete submissions before they reach managers.`;
    }
    const prompt = `Suggest a single, innovative 2-sentence optimization recommendation for a business workflow of type "${workflowType}". Keep it brief and professional.`;
    
    return await callGemini(prompt);
  } catch (error) {
    console.error('Gemini Recommendation error:', error.message);
    return `AI Recommendation (Fallback): Ensure all details for "${workflowType}" are verified early to optimize manager review times.`;
  }
};