const fetch = require('node-fetch');


const API_KEY = process.env.GEMINI_API_KEY;
console.log("Clé API Gemini :", API_KEY);

async function generateText(prompt) {
  const API_KEY = process.env.GEMINI_API_KEY;
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
        try {
            const errorText = await response.text(); // Tenter de lire le corps de la réponse (peut être HTML ou JSON)
            console.error("Réponse d'erreur de l'API Gemini :", errorText); // Afficher le contenu de l'erreur
            const errorData = JSON.parse(errorText); // Essayer de parser en JSON, même si ça peut échouer
            throw new Error(`Erreur lors de l'appel à l'API Gemini: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        } catch (parseError) {
            // Si la réponse n'est pas du JSON (ex: HTML), afficher l'erreur brute
            throw new Error(`Erreur lors de l'appel à l'API Gemini: ${response.status} ${response.statusText} - ${errorText}`);
        }
    }

    const data = await response.json();
    return data;
}

module.exports = { generateText };


