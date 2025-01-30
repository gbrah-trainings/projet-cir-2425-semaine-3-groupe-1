const fetch = require('node-fetch');

async function generateText(prompt) {
  const API_KEY = process.env.GEMINI_API_KEY;
  const response = await fetch('https://api.gemini.google.com/v1/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Erreur lors de l'appel à l'API Gemini: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data;
}

module.exports = { generateText };