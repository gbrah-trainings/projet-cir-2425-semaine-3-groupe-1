const express = require('express');
const router = express.Router();
const geminiService = require('./geminiServices');

router.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const data = await geminiService.generateText(prompt);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue' });
  }
});

module.exports = router;