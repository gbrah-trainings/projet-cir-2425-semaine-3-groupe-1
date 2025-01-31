function generateAnnonces(data, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  data.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('annonce-card');
      
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = `Image annonce ${item.name}`;
      img.classList.add('annonce-image');

      const title = document.createElement('h3');
      title.classList.add('annonce-title');
      title.textContent = item.name;

      const description = document.createElement('p');
      description.classList.add('annonce-description');
      description.textContent = item.subject;

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(description);

      container.appendChild(card);
  });
}


// Appeler la fonction pour remplir les sections avec les données


// Gérer le défilement des annonces
document.querySelectorAll('.left-arrow').forEach((arrow, index) => {
  arrow.addEventListener('click', () => {
      const container = index === 0 ? document.getElementById('mentors-container') : document.getElementById('students-container');
      container.scrollBy({
          left: -200, // Défilement vers la gauche
          behavior: 'smooth'
      });
  });
});

document.querySelectorAll('.right-arrow').forEach((arrow, index) => {
  arrow.addEventListener('click', () => {
      const container = index === 0 ? document.getElementById('mentors-container') : document.getElementById('students-container');
      container.scrollBy({
          left: 200, // Défilement vers la droite
          behavior: 'smooth'
      });
  });
});


// Gestion du header : lire le cookie et voir si on est connecté
const storedUserData = localStorage.getItem('user');
if(storedUserData){

  // Récupérer les données de l'utilisateur connecté
  const userData = JSON.parse(storedUserData);

  const headerNav = document.querySelector('.header-nav');
  const newListItem = document.createElement('li');
  const newLink = document.createElement('a');

  newLink.href = 'profil.html';
  newLink.className = 'header-link';
  newLink.textContent = 'Espace personnel';

  newListItem.appendChild(newLink);
  headerNav.appendChild(newListItem);

}else{

  const headerNav = document.querySelector('.header-nav');
  const newListItem = document.createElement('li');
  const newLink = document.createElement('a');

  newLink.href = 'inscription.html';
  newLink.className = 'header-link';
  newLink.textContent = 'Inscription';

  newListItem.appendChild(newLink);
  headerNav.appendChild(newListItem);
}


// Sinon est connecté, afficher le nom et la photo

//Creation des fonctions à base de l'api
async function getUserInfo(userID, parametre) {
  const response = await fetch(`/getUser/${userID}?parametre=${parametre}`);
  const data = await response.json();
  console.log(data);
}   

//selection de tout les comptes avec des mentorats 
async function getMentoringPosts(userID, teacher) {
  try {

      const response = await fetch(`/getMentoringPosts/${userID}?teacher=${teacher}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();

      return Array.isArray(data) ? [...data] : []; // Clonage du tableau pour éviter toute modification par référence

  } catch (error) {
      console.error(`❌ Erreur lors de la récupération des posts pour userID=${userID}, teacher=${teacher} :`, error);
      return [];
  }
}




async function buildMentoringData(userIDs) {

  let mentorsData = [];
  let studentsData = [];

  try {
      for (let userID of userIDs) {

          try {
              const teacherPosts = await getMentoringPosts(userID, true);

              if (teacherPosts.length > 0) {
                  teacherPosts.forEach(post => {
                      mentorsData.push({
                          name: post.name || `User ${userID}`,
                          subject: post.Subject,
                          image: "./img/Prof1.jpg",
                          category: post.Subject
                      });
                  });
              }
          } catch (error) {
              console.error(`❌ Erreur dans getMentoringPosts(userID=${userID}, teacher=true) :`, error);
          }

          try {
              const studentPosts = await getMentoringPosts(userID, false);

              if (studentPosts.length > 0) {
                  studentPosts.forEach(post => {
                      studentsData.push({
                          name: post.name || `User ${userID}`,
                          subject: post.Subject,
                          image: "./img/Prof1.jpg",
                          category: post.Subject
                      });
                  });
              }
          } catch (error) {
              console.error(`❌ Erreur dans getMentoringPosts(userID=${userID}, teacher=false) :`, error);
          }

      }
  } catch (error) {
      console.error("❌ Erreur bloquante dans buildMentoringData :", error);
  }

  return { mentorsData, studentsData };
}


async function getAllUserIDs() {
  try {
      const response = await fetch('/getAllUsers', { method: 'GET' });


      if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${await response.text()}`);
      }

      const users = await response.json();

      return users.map(user => user.UserID);
  } catch (error) {
      console.error("❌ Erreur lors de la récupération des utilisateurs :", error);
      return [];
  }
}


(async () => {
  const userIDs = await getAllUserIDs();
  const { mentorsData, studentsData } = await buildMentoringData(userIDs);

  console.log("📌 Mentors :", mentorsData);
  console.log("📌 Étudiants :", studentsData);
  generateAnnonces(mentorsData, 'mentors-container');
generateAnnonces(studentsData, 'students-container');
})();

document.getElementById('apply-filters').addEventListener('click', async () => {
  const typeFilter = document.getElementById('filter-type').value;
  const subjectFilter = document.getElementById('filter-subject').value;

  const userIDs = await getAllUserIDs();
  const { mentorsData, studentsData } = await buildMentoringData(userIDs);    

  let filteredMentors = mentorsData;
  let filteredStudents = studentsData;

  if (subjectFilter !== 'all') {
      filteredMentors = filteredMentors.filter(m => m.category === subjectFilter);
      filteredStudents = filteredStudents.filter(s => s.category === subjectFilter);
  }

  if (typeFilter === 'mentors') {
      generateAnnonces(filteredMentors, 'mentors-container');
      document.getElementById('students-container').innerHTML = "";
  } else if (typeFilter === 'students') {
      generateAnnonces(filteredStudents, 'students-container');
      document.getElementById('mentors-container').innerHTML = "";
  } else {
      generateAnnonces(filteredMentors, 'mentors-container');
      generateAnnonces(filteredStudents, 'students-container');
  }
});

/* ------- A partir de l'email, voir si le compte existe -------------- */
/*
return  True  si le compte existe
return  False sinon
*/
import { client } from './backend/setupDB/connectDB.mjs'; // Assure-toi que la connexion est bien récupérée

app.get('/doesAccountExist/:email', async (req, res) => {
  try {
      const email = req.params.email.trim().toLowerCase(); // Nettoyage des espaces et normalisation
      console.log("🔍 Email reçu pour vérification :", `"${email}"`);

      const db = client.db("users"); // Connexion à la base
      const collection = db.collection("users");

      const user = await collection.findOne(
          { email: { $regex: `^${email}$`, $options: "i" } },
          { projection: { _id: 0, UserID: 1 } } // Ne retourne que l'ID utilisateur
      );

      if (user) {
          console.log("🔍 Utilisateur trouvé, UserID :", user.UserID);
          res.status(200).json({ exists: true, userID: user.UserID });
      } else {
          console.log("❌ Aucun utilisateur trouvé");
          res.status(404).json({ exists: false, error: "Aucun utilisateur trouvé avec cet email." });
      }

  } catch (error) {
      console.error("❌ Erreur lors de la vérification du compte :", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
  }
});


