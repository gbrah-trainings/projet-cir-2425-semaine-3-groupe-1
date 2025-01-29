import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';


import { addNewUserInDB } from './backend/setupDB/connectDB.mjs';

// Configurer `__dirname` pour ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(bodyParser.json());

// ----------- FORM D'INSCRIPTION -------------------------------------------------------
app.post('/inscriptionSubmit', (req, res) => {

  // Trop bien
  const username = req.body["username"]
  const firstname = req.body["firstname"];
  const ville = req.body["ville"];
  const email = req.body["email"];
  const numero = req.body["numero"];
  const gender = req.body["gender"];
  const education_level = req.body["education_level"];
  const hidden_teaching_subject = req.body["hidden-teaching-subject"];

  const password = req.body["password"];
  const confirm_password = req.body["confirm_password"];

  let teaching_subject;
  if (hidden_teaching_subject) {
      teaching_subject = JSON.parse(hidden_teaching_subject);
  } else {
      teaching_subject = [];
  }


  // Validation des champs requis
  if (!username || !firstname || !ville || !email || !numero || !password || !confirm_password || !education_level) {
    return res.status(400).json({ error: 'Tous les champs obligatoires (marqués par *) doivent être remplis.' });
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
    // Toutes les entrées sont alors sécurisées
    
    addNewUserInDB(firstname, username, email, password, false, gender, numero, education_level, teaching_subject, ville);

    res.status(201).json({ message: "Inscription réussie !" });
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error);
    res.status(500).json({ error: 'Une erreur est survenue, veuillez réessayer plus tard.' });
  }

});

app.post('/loginSubmit', (req, res) => {
  console.log(req.body);

  // TODO : login, return 500 ou 200 selon la réussite

  res.status(200).json({ message: "Connexion réussie." });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

//------------------------------------<<<Create_Annonces>>>--------------------------------


app.post('/submitAnnonce', (req, res) => {
  const { role, subjects, address, radius, startDate, availabilities } = req.body;

  if (!role || subjects.length === 0 || !startDate || availabilities.length === 0) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis.' });
  }

  try {
      saveAnnonceInDB(role, subjects, address, radius, startDate, availabilities);

      res.status(201).json({ message: "Annonce enregistrée avec succès !" });
  } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'annonce :", error);
      res.status(500).json({ error: "Une erreur est survenue, veuillez réessayer plus tard." });
  }
});

