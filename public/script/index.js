// Données dynamiques pour les mentors et étudiants
const mentorsData = [
    { name: "Didier", subject: "Prof de Techno", image: "./img/Prof1.jpg" },
    { name: "Bertrand", subject: "Prof de Physique", image: "./img/Prof2.png" },
    { name: "Patrick", subject: "Prof de Maths", image: "./img/Prof1.jpg" },
    { name: "Bélatrice", subject: "Prof de Français", image: "./img/Prof1.jpg" },
    { name: "Juliette", subject: "Prof d'Anglais", image: "./img/Prof1.jpg" }
];

const studentsData = [
    { name: "Sarah", subject: "Étudiante en Physique", image: "./img/Prof1.jpg" },
    { name: "Lucas", subject: "Étudiant en Mathématiques", image: "./img/Prof2.png" },
    { name: "Nina", subject: "Étudiante en Informatique", image: "./img/Prof1.jpg" },
    { name: "Mickaël", subject: "Étudiant en Chimie", image: "./img/Prof2.png" },
    { name: "Claire", subject: "Étudiante en Biologie", image: "./img/Prof1.jpg" }
];

// Fonction pour générer les cartes d'annonces
function generateAnnonces(data, containerId) {
    const container = document.getElementById(containerId);
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

generateAnnonces(mentorsData, 'mentors-container');
generateAnnonces(studentsData, 'students-container');

document.getElementById('apply-filters').addEventListener('click', () => {
    const typeFilter = document.getElementById('filter-type').value;
    const subjectFilter = document.getElementById('filter-subject').value;
    
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

// Appeler la fonction pour remplir les sections avec les données
generateAnnonces(mentorsData, 'mentors-container');
generateAnnonces(studentsData, 'students-container');

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

    
