const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.use(bodyParser.json());

// ----------- FORM D'INSCRIPTION -------------------------------------------------------
app.post('/submit', (req, res) => {

  // Trop bien
  const username = req.body["username"]
  const firstname = req.body["firstname"];
  const ville = req.body["ville"];
  const email = req.body["email"];
  const numero = req.body["numero"];
  const gender = req.body["gender"];
  const education_level = req.body["education_level"];
  const teaching_subject = req.body["teaching_subject"];
  const password = req.body["password"];
  const confirm_password = req.body["confirm_password"];

  if(password != confirm_password)  res.status(400).json({ error: 'Les mots de passe ne correspondent pas.' });
  
  // Validation des champs requis
  if (!username || !firstname || !ville || !email || !numero || !password || !confirm_password) {
    return res.status(400).json({ error: 'Tous les champs doivent être remplis.' });
  }

  // Validation de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "L'email est invalide." });
  }

  // Validation du numéro de téléphone (exemple pour 10 chiffres)
  const numeroRegex = /^[0-9]{10}$/;
  if (!numeroRegex.test(numero)) {
    return res.status(400).json({ error: 'Le numéro de téléphone est invalide.' });
  }

  // Validation du mot de passe
  
  if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    return res.status(400).json({
      error: 'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre.',
    });
  }

  // Vérification de la correspondance des mots de passe
  if (password !== confirm_password) {
    return res.status(400).json({ error: 'Les mots de passe ne correspondent pas.' });
  }

  try {
    // Hachage du mot de passe
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Simulez l'insertion dans une base de données
    // Exemple :
    // await database.insertUser({ username, firstname, ville, email, numero, gender, education_level, teaching_subject, hashedPassword });

    res.status(201).json({ message: "Inscription réussie !" });
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error);
    res.status(500).json({ error: 'Une erreur est survenue, veuillez réessayer plus tard.' });
  }

});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



