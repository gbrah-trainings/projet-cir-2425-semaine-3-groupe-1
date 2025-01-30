const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id'); // Récupère l'ID de l'URL

fetch(`http://localhost:3000/profile?id=${id}`)
    .then(response => response.json())
    .then(data => console.log("Données du serveur:", data))
    .catch(error => console.error("Erreur:", error));



console.log("ID récupéré:", id);
const user_id = id;
    

async function getUserInfo(userID, parametre) {
    const response = await fetch(`/getUser/${userID}?parametre=${parametre}`);
    const data = await response.json();
    return data;

}   

document.addEventListener("DOMContentLoaded", async function () {

    // Si le profil consulté est le sien
    // On souhaite afficher le profil de l'utilisateur connecté
    const storedUserData = localStorage.getItem('user');

    if (storedUserData) {

        const userData = JSON.parse(storedUserData);
        if(user_id == userData.id) window.location.href = "edit_profil.html"

    } else {
        window.location.href = "index.html"
    }

    // On vérifie que l'utilisateur existe.
    const test = (await getUserInfo(user_id, "name")).name;
    if (!test) window.location.href = "index.html";


    // Récupérer les annonces postées
    const annonces_postees = (await getUserInfo(user_id, "postedSearchs")).postedSearchs;
    let annonces_teacher = [];
    let annonces_eleve = [];

    annonces_postees.forEach(element => {
        if(element.IsTeacher){
            // Trier les annonces postées en tant que professeur
            annonces_teacher.push(element);
        }else{
            // Trier les annonces postées en tant qu'élève
            annonces_eleve.push(element);
        }
    });


    //annoncesProposees
    let annoncesProposees = [];
    annonces_teacher.forEach(annonce => {
        annoncesProposees.push({title: annonce.Subject, description:"", image: "./img/profiles.png"})
    });

    //annoncesRecherchees
    let annoncesRecherchees = [];
    annonces_eleve.forEach(annonce => {
        annoncesRecherchees.push({title: annonce.Subject, description:"", image: "./img/profiles.png"})
    });

    // Récuperer le nombres de cours donnés ("mentorships")


    // Récupérer la liste des professeurs
    // TODO

    // Récuperer la liste des élèves
    // TODO

    // Données fictives pour le profil
    const userProfile = {
        firstName: (await getUserInfo(user_id, "name")).name,
        lastName: (await getUserInfo(user_id, "surname")).surname,
        email: (await getUserInfo(user_id, "email")).email,
        education: (await getUserInfo(user_id, "niveauEtudes")).niveauEtudes,
        courses: (await getUserInfo(user_id, "competences")).competences,
        mentorships: (await getUserInfo(user_id, "nbMentorats")).nbMentorats,
        mentors: [1,2,3,4], // Les ID des professeurs du détenteur du compte
        mentores: [5,4,6,1], // Les ID des élèves du détenteur du compte
        annoncesProposees: annoncesProposees,
        annoncesRecherchees: annoncesRecherchees
    };

    // Fonction pour remplir les informations du profil dans la page
    function updateProfile() {

        // A DECOMMENTER EN PROD
        document.getElementById("profile-name").textContent = `${userProfile.firstName} ${userProfile.lastName}`;

        // DEBUG ONLY
        // document.getElementById("profile-name").textContent = `${userProfile.firstName} ${userProfile.lastName} (${user_id})`;

        document.getElementById("profile-lastname").textContent = userProfile.lastName;
        document.getElementById("profile-firstname").textContent = userProfile.firstName;
        document.getElementById("profile-email").textContent = userProfile.email;
        document.getElementById("profile-education").textContent = userProfile.education;
        document.getElementById("courses-taken").textContent = userProfile.courses.join(", ");
        document.getElementById("mentorships-done").textContent = userProfile.mentorships;
        document.getElementById("profile-courses-count").textContent = userProfile.courses.length;
    }

    // Fonction pour remplir une liste avec images et noms (mentors et mentorés)
    function populateListWithImages(elementId, dataArray, countElementId) {
        const list = document.getElementById(elementId);
        const countElement = document.getElementById(countElementId);
        list.innerHTML = ""; // Vider la liste existante

        dataArray.forEach(async item => { // Item qui est du coup un ID
            const div = document.createElement("div");
            div.classList.add("mentor-item");

            const img = document.createElement("img");
            img.src = "./img/profiles/" + item + ".png";
            img.alt = `Image de ${item.name}`;
            img.classList.add("mentor-image");

            const name = document.createElement("span");
            name.classList.add("mentor-name");

            console.log(item);
            console.log(await getUserInfo(item, "name"));
            name.textContent = (await getUserInfo(item, "name")).name;

            div.appendChild(img);
            div.appendChild(name);

            div.addEventListener('click', () => window.location.href = `http://localhost:3000/profil.html?id=${item}` );

            div.style.cursor = 'pointer';

            list.appendChild(div);
        });

        countElement.textContent = dataArray.length;
    }

    // Remplir les listes de mentors et mentorés
    populateListWithImages("mentors-list", userProfile.mentors, "mentors-count");
    populateListWithImages("mentores-list", userProfile.mentores, "mentores-count");

    // Fonction pour générer les annonces
    function generateAnnonces(data, containerId) {
        const container = document.getElementById(containerId);
        data.forEach((item, index) => {
            const card = document.createElement("div");
            card.classList.add("annonce-card");

            // Créer l'image
            const img = document.createElement("img");
            img.src = item.image;
            img.alt = `Image annonce ${item.title}`;
            img.classList.add("annonce-image");

            // Créer le titre
            const title = document.createElement("h3");
            title.classList.add("annonce-title");
            title.textContent = item.title;

            // Créer la description
            const description = document.createElement("p");
            description.classList.add("annonce-description");
            description.textContent = item.description;

            // Ajouter les éléments à la carte
            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(description);

            // Ajouter la carte au conteneur
            container.appendChild(card);
        });
    }

    // Générer les annonces proposées et recherchées
    generateAnnonces(userProfile.annoncesProposees, "annonces-proposees");
    generateAnnonces(userProfile.annoncesRecherchees, "annonces-recherchees");

    // Gérer le défilement des annonces
    document.querySelectorAll('.left-arrow').forEach((arrow, index) => {
        arrow.addEventListener('click', () => {
            const container = index === 0 ? document.getElementById('annonces-proposees') : document.getElementById('annonces-recherchees');
            container.scrollBy({
                left: -200,
                behavior: 'smooth'
            });
        });
    });

    document.querySelectorAll('.right-arrow').forEach((arrow, index) => {
        arrow.addEventListener('click', () => {
            const container = index === 0 ? document.getElementById('annonces-proposees') : document.getElementById('annonces-recherchees');
            container.scrollBy({
                left: 200,
                behavior: 'smooth'
            });
        });
    });

    // Fonction pour désactiver le défilement de la page
    function disableScroll() {
        document.body.classList.add('no-scroll');
    }

    // Fonction pour réactiver le défilement de la page
    function enableScroll() {
        document.body.classList.remove('no-scroll');
    }

    // Initialiser le profil sur la page
    updateProfile();
});

