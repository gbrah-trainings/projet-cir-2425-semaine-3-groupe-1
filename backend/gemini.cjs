const express = require('express'); // Use require for CommonJS
const router = express.Router();




router.post('/generate', async (req, res) => {
    const { prompt } = req.body;

    try {
		const { default: llm } = await import('../llm.js');
		const { default: geminiServices } = await import('./geminiServices.js'); 
        const response = await llm.generate([prompt]); // Utilisez le modèle LangChain pour générer la réponse
        res.json({ response: response.choices[0].text.trim() });
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Gemini :", error);
        res.status(500).json({ message: 'Erreur lors de la génération de la réponse.' });
    }
});


module.exports = router; // Export geminiRoutes as the default export