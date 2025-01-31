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

async function getUserSurnames() {
    try {
        const response = await fetch('/getAllUsers', { method: 'GET' });

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${await response.text()}`);
        }

        const users = await response.json();

        // Convertir en un objet { userID: surname }
        let surnameMap = {};
        users.forEach(user => {
            surnameMap[user.UserID] = user.surname;
        });

        return surnameMap;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des surnoms :", error);
        return {};
    }
}


async function buildMentoringData(userIDs) {
    let mentorsData = [];
    let studentsData = [];

    // Récupérer les surnoms des utilisateurs
    const surnameMap = await getUserSurnames();
    console.log("================================================================")
    console.log("📌 Surnoms récupérés :", surnameMap);
    console.log("================================================================")
    try {
        for (let userID of userIDs) {
            const surname = surnameMap[userID] || `User ${userID}`; // Récupère le surname ou met "User X"

            try {
                const teacherPosts = await getMentoringPosts(userID, true);

                if (teacherPosts.length > 0) {
                    teacherPosts.forEach(post => {
                        mentorsData.push({
                            name: surname, // Utilisation du surname récupéré
                            subject: post.Subject,
                            //chemin vers la photo de profil: ./img/userID.jpg
                            image: "./img/profiles/"+userID+".png",
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
                            name: surname, // Utilisation du surname récupéré
                            subject: post.Subject,
                            image: "./img/profiles/"+userID+".png",
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
let studentsData = [];

async function updateSubjectFilter() {
    const subjectFilter = document.getElementById('filter-subject');
    subjectFilter.innerHTML = '<option value="all">Tous</option>'; 


    const subjects = new Set([
        ...mentorsData.map(m => m.category),
        ...studentsData.map(s => s.category)
    ]);

    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectFilter.appendChild(option);
    });
}

(async () => {
    const userIDs = await getAllUserIDs(); // Récupère uniquement les IDs
    const data = await buildMentoringData(userIDs); // Utilise getUserSurnames() pour ajouter les surnoms

    mentorsData = data.mentorsData;
    studentsData = data.studentsData;

    console.log("📌 Mentors :", mentorsData);
    console.log("📌 Étudiants :", studentsData);

    generateAnnonces(mentorsData, 'mentors-container');
    generateAnnonces(studentsData, 'students-container');

    updateSubjectFilter();
})();


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