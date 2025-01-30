async function getUserInfo(userID, parametre) {
    const response = await fetch(`/getUser/${userID}?parametre=${parametre}`);
    const data = await response.json();
    return data;
}   


async function setUserInfo(userID, parametre, value) {
    const response = await fetch(`/updateUser/${userID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [parametre]: value })
    });

    if (!response.ok) {
        console.error("❌ Erreur:", response.status, response.statusText);
        return null;
    }

    const data = await response.json();
    console.log("✅ Réponse du serveur:", data);
    return data;
}


async function deleteUserAccount(userID) {
    const response = await fetch(`/deleteUser/${userID}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    return data;
}

document.addEventListener("DOMContentLoaded", async function () {

    let user_id = 0;

    // On souhaite afficher le profil de l'utilisateur connecté
    const storedUserData = localStorage.getItem('user');

    if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        user_id = userData.id
    } else {
        window.location.href = "index.html"
    }

    // On vérifie que l'utilisateur existe... Ouais bon, on ne sait jamais hein ^^'
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


    // Récupérer la liste des professeurs
    // TODO

    // Récuperer la liste des élèves
    // TODO

    const userProfile = {
        firstName: (await getUserInfo(user_id, "name")).name,
        lastName: (await getUserInfo(user_id, "surname")).surname,
        email: (await getUserInfo(user_id, "email")).email,
        education: (await getUserInfo(user_id, "niveauEtudes")).niveauEtudes,
        courses: (await getUserInfo(user_id, "competences")).competences,
        mentorships: (await getUserInfo(user_id, "nbMentorats")).nbMentorats,
        mentors: [
            { name: "Marie Curie", image: "./img/Prof1.jpg" },
            { name: "Alan Turing", image: "./img/Prof1.jpg" },
            { name: "Alice Martin", image: "./img/Prof1.jpg" },
            { name: "Bob Dubois", image: "./img/Prof1.jpg" }
        ],
        mentores: [
            { name: "Alice Martin", image: "./img/Prof1.jpg" },
            { name: "Bob Dubois", image: "./img/Prof1.jpg" },
            { name: "Marie Curie", image: "./img/Prof1.jpg" },
            { name: "Alan Turing", image: "./img/Prof1.jpg" }
        ],
        annoncesProposees: annoncesProposees,
        annoncesRecherchees: annoncesRecherchees
    };

    // Photo de profil de l'utilisateur connecté
    document.getElementById("profile-picture").src = ("./img/profiles/"+user_id+".png");

    // Fonction pour remplir les informations du profil dans la page
    function updateProfile() {
        document.getElementById("profile-name").textContent = `${userProfile.firstName} ${userProfile.lastName}`;
        document.getElementById("profile-lastname").placeholder = userProfile.lastName;
        document.getElementById("profile-firstname").placeholder = userProfile.firstName;
        document.getElementById("profile-email").placeholder = userProfile.email;
        document.getElementById("profile-education").placeholder = userProfile.education;
        document.getElementById("courses-taken").textContent = userProfile.courses.join(", ");
        document.getElementById("mentorships-done").textContent = userProfile.mentorships;
        document.getElementById("profile-courses-count").textContent = userProfile.courses.length;
    }

    // Fonction pour remplir une liste avec images et noms (mentors et mentorés)
    function populateListWithImages(elementId, dataArray, countElementId) {
        const list = document.getElementById(elementId);
        const countElement = document.getElementById(countElementId);
        list.innerHTML = ""; // Vider la liste existante

        dataArray.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("mentor-item");

            const img = document.createElement("img");
            img.src = item.image;
            img.alt = `Image de ${item.name}`;
            img.classList.add("mentor-image");

            const name = document.createElement("span");
            name.classList.add("mentor-name");
            name.textContent = item.name;

            div.appendChild(img);
            div.appendChild(name);

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

            // Créer le bouton de suppression
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-annonce-button");
            deleteButton.textContent = "Supprimer";

            // Ajouter l'événement de suppression
            deleteButton.addEventListener("click", function () {
                container.removeChild(card);
            });

            // Ajouter les éléments à la carte
            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(deleteButton);

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

    // Gestion des modals : édition et suppression du profil
    const editButton = document.getElementById("edit-profile-button");
    const modal = document.getElementById("edit-profile-modal");
    const cancelButton = document.getElementById("cancel-edit-button");
    const saveButton = document.getElementById("save-profile-button");

    const deleteAccountButton = document.getElementById("delete-account-button");
    const deleteConfirmationModal = document.getElementById("delete-confirmation-modal");
    const confirmDeleteButton = document.getElementById("confirm-delete-button");
    const cancelDeleteButton = document.getElementById("cancel-delete-button");

    // Ouvrir le modal pour modifier le profil
    editButton.addEventListener("click", function () {
        document.getElementById("edit-firstname").value = userProfile.firstName;
        document.getElementById("edit-lastname").value = userProfile.lastName;
        document.getElementById("edit-email").value = userProfile.email;
        document.getElementById("edit-education").value = userProfile.education;

        modal.style.display = "flex";
        disableScroll(); // Désactiver le défilement lors de l'ouverture du modal
    });

    // Annuler l'édition du profil
    cancelButton.addEventListener("click", function () {
        modal.style.display = "none";
        enableScroll(); // Réactiver le défilement lors de la fermeture du modal
    });

    // Sauvegarder les modifications du profil
    saveButton.addEventListener("click", function () {
        userProfile.firstName = document.getElementById("edit-firstname").value;
        userProfile.lastName = document.getElementById("edit-lastname").value;
        userProfile.email = document.getElementById("edit-email").value;
        userProfile.education = document.getElementById("edit-education").value;

        updateProfile(); // Mettre à jour le profil sur la page

        // TODO : modifier le profil dans le serveur
        setUserInfo(user_id, "name", 1);

        modal.style.display = "none";
        enableScroll(); // Réactiver le défilement
    });

    // Ouvrir le modal de confirmation de suppression
    deleteAccountButton.addEventListener("click", function () {
        deleteConfirmationModal.style.display = "flex";
        disableScroll(); // Désactiver le défilement lors de l'ouverture du modal
    });

    // Confirmer la suppression du compte
    confirmDeleteButton.addEventListener("click", function () {

        // TODO : supprimer le compte
        deleteUserAccount(user_id);

        alert("Le compte a été supprimé.");
        window.location.href = "/login.html";
        deleteConfirmationModal.style.display = "none";
        enableScroll(); // Réactiver le défilement après suppression
    });

    // Annuler la suppression du compte
    cancelDeleteButton.addEventListener("click", function () {
        deleteConfirmationModal.style.display = "none";
        enableScroll(); // Réactiver le défilement si l'utilisateur annule
    });

    // Initialiser le profil sur la page
    updateProfile();
});

