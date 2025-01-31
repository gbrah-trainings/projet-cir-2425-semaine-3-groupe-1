const express = require('express');
const router = express.Router();
const geminiServices = require('./geminiServices');

router.post('/generate', async (req, res) => {
    const { prompt } = req.body;
    console.log("Prompt reçu par le serveur :", prompt); // Pour débogage


    try {
        const data = await geminiServices.generateText(prompt);
        console.log("Réponse de Gemini :", data); // Pour débogage
        res.json(data);
    } catch (error) {
        console.error("Erreur dans /generate :", error);
        res.status(500).json({ error: 'Une erreur est survenue' });
    }
});

module.exports = router;