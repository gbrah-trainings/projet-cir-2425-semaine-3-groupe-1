import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import session from 'express-session';
<<<<<<< Updated upstream
import cors from 'cors';

import { addNewUserInDB, login, getterUser, setterUser, deleteUserInDB, getAllTeacherPosts, getAllStudentPosts } from './backend/setupDB/connectDB.mjs';
=======
require('dotenv').config();
import { addNewUserInDB, login } from './backend/setupDB/connectDB.mjs';
>>>>>>> Stashed changes

// Configurer `__dirname` pour ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(bodyParser.json());


// ----------- SESSION CONFIG -----------------------------------------------------------
app.use(session({
  secret: '3e63a7dcfc55e1ec34775b8b0e36614facfbae06e059921921b8ac5994c16a33', // Arbitraire
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 } // 1 jour
}));


// ----------- FORM D'INSCRIPTION -------------------------------------------------------
app.post('/inscriptionSubmit', (req, res) => {

  // Trop bien
  const username = req.body["username"]
  const firstname = req.body["firstname"];
  const ville = req.body["ville"];
  const email = req.body["email"];
  const numero = req.body["numero"];
  const gender = req.body["gender"];
  const education_level = req.body["education-level"];
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
    // Toutes les entrées sont sécurisées. En gros.
    addNewUserInDB(firstname, username, email, password, false, gender, numero, education_level, teaching_subject, ville, 0);

    res.status(201).json({ message: "Inscription réussie !" });
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error);
    res.status(500).json({ error: 'Une erreur est survenue, veuillez réessayer plus tard.' });
  }

});



// ----------- FORM DE CONNEXION --------------------------------------------------------
app.post('/loginSubmit', async (req, res) => {
  const email_phone = req.body["email_phone"];
  const password = req.body["password"];

  if (!email_phone || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  try {
    
    const ret = await login(email_phone, password);
    if(ret == -1){
      res.status(500).json({ error: "Cet utilisateur n'existe pas dans la base de données." });
    }else if (ret == 0){
      res.status(500).json({ error: "Mot de passe incorrect." });
    }else{
        // Supposons que `ret` contient l'ID utilisateur
        const user_id = ret; 

        // Stocker les infos de l'utilisateur dans la session
        req.session.user = {
          id: user_id,
          username: "USERNAME_TODO"
        };

        // Génération d'un token simple (id + timestamp)
        const authToken = `${user_id}-${Date.now()}`;

        // Stocker le token dans un cookie HTTP sécurisé
        res.cookie('auth_token', authToken, {
          httpOnly: true, // Sécurisé, inaccessible en JS côté client
          secure: false,  // Mettre `true` en production avec HTTPS
          maxAge: 24 * 60 * 60 * 1000 // Expiration dans 24h
        });

        // Réponse JSON avec les infos nécessaires
        return res.status(200).json({
          message: "Connexion réussie.",
          user: {
            id: user_id,
            username: ("USERNAME_TODO_ID_"+user_id)
          },
          token: authToken
        });
      }

    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      res.status(500).json({ error: 'Une erreur est survenue, veuillez réessayer plus tard.' });
    }

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


/* =================== API Delete Compte =================== */

app.delete('/deleteUser/:userID', async (req, res) => {
  try {
      const userID = parseInt(req.params.userID);
      if (!userID) {
          return res.status(400).json({ error: "UserID requis pour la suppression" });
      }

      const result = await deleteUserInDB(userID);
      if (!result.deleted) {
          return res.status(404).json({ error: result.message });
      }

      res.status(200).json({ message: result.message });

  } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
  }
});


/* =================== API Getter info user =================== */
app.get('/getUser/:userID', async (req, res) => {
  try {
      const userID = parseInt(req.params.userID);
      const { parametre } = req.query; // Le paramètre demandé (ex: email, tel, etc.)

      if (!userID || !parametre) {
          return res.status(400).json({ error: "UserID et paramètre requis" });
      }

      const value = await getterUser(parametre, userID);
      if (value === null) {
          return res.status(404).json({ error: `Utilisateur introuvable ou paramètre "${parametre}" inexistant.` });
      }

      res.status(200).json({ [parametre]: value });

  } catch (error) {
      console.error("❌ Erreur lors de la récupération de l'utilisateur :", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

/* =================== API Setter info user =================== */
app.put('/updateUser/:userID', async (req, res) => {
  try {
      const userID = parseInt(req.params.userID);
      const { parametre, valeur } = req.body;

      if (!userID || !parametre || valeur === undefined) {
          return res.status(400).json({ error: "UserID, paramètre et valeur sont requis pour la mise à jour." });
      }

      const result = await setterUser(parametre, valeur, userID);

      if (result === null) {
          return res.status(404).json({ error: `Aucun utilisateur trouvé avec l'ID ${userID}.` });
      }

      res.status(200).json({ message: `Mise à jour réussie : ${parametre} = ${valeur} pour l'utilisateur ${userID}` });

  } catch (error) {
      console.error("❌ Erreur lors de la mise à jour :", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

/* =================== API Getter all posts =================== */

app.get('/getAllStudentPosts', async (req, res) => {
  try {
      const posts = await db.getAllStudentPosts();
      res.status(200).json(posts);
  } catch (error) {
      console.error("Erreur lors de la récupération des annonces des étudiants :", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

app.get('/getAllTeacherPosts', async (req, res) => {
    try {
        const posts = await db.getAllTeacherPosts();
        res.status(200).json(posts);
    } catch (error) {
        console.error("Erreur lors de la récupération des annonces des enseignants :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});


/* =================== Ouvrir le profil selon l'ID =================== */

app.get('/profile', (req, res) => {
  const id = req.query.id; // Récupération de l'ID depuis l'URL
  res.json({ id }); // Renvoie l'ID au client
});