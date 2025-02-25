async function getUserInfo(userID, parametre) {
    const response = await fetch(`/getUser/${userID}?parametre=${parametre}`);
    const data = await response.json();
    return data;
}   


async function setUserInfo(userID, parametre, valeur) {


    try {
        const response = await fetch(`/updateUser/${userID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ parametre, valeur })
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || "Erreur inconnue");
        }

        console.log("✅ Mise à jour réussie :", result.message);
        return result; // Retourne la réponse en JSON
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour :", error);
        return { error: error.message };
    }
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

    // On est bien obligés de mettre une valeur par défaut à user_id ;)
    let user_id = 0;

    // On souhaite afficher le profil de l'utilisateur connecté
    const storedUserData = localStorage.getItem('user');

    if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        user_id = userData.id
    } else {
        // On ne peut pas éditer le profil d'un autre. Ah, non !
        window.location.href = "index.html"
    }

    // On vérifie quand même que l'utilisateur existe... Ouais bon, on ne sait jamais hein ^^'
    const test = (await getUserInfo(user_id, "name")).name;
    if (!test) window.location.href = "index.html";
    // Oui bon, à priori ça ne sert à rien. On ne sait jamais.

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


    // Récupérer la liste des ID des professeurs
    // TODO

    // Récuperer la liste des ID des élèves
    // TODO

    const userProfile = {
        firstName: (await getUserInfo(user_id, "name")).name,
        lastName: (await getUserInfo(user_id, "surname")).surname,
        email: (await getUserInfo(user_id, "email")).email,
        education: (await getUserInfo(user_id, "niveauEtudes")).niveauEtudes,
        courses: (await getUserInfo(user_id, "competences")).competences,
        mentorships: (await getUserInfo(user_id, "nbMentorats")).nbMentorats,
        
        // TODO
        mentors: [1,2,3,4], // Les ID des professeurs du détenteur du compte
        mentores: [5,6,7,8], // Les ID des élèves du détenteur du compte

        annoncesProposees: annoncesProposees,
        annoncesRecherchees: annoncesRecherchees
    };

    // Photo de profil de l'utilisateur connecté
    document.getElementById("profile-picture").src = ("./img/profiles/"+user_id+".png");

    // Fonction pour remplir les informations du profil dans la page
    function updateProfile() {
        document.getElementById("profile-name").textContent = `${userProfile.firstName} ${userProfile.lastName}`;
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

            const user_name = (await getUserInfo(item, "name")).name;

            const img = document.createElement("img");
            img.src = "./img/profiles/" + item + ".png";
            img.alt = `Image de ${user_name}`;
            img.classList.add("mentor-image");

            const name = document.createElement("span");
            name.classList.add("mentor-name");

            name.textContent = user_name;

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
        // Récupération et nettoyage des entrées utilisateur
        let firstName = document.getElementById("edit-firstname").value.trim();
        let lastName = document.getElementById("edit-lastname").value.trim();
        let email = document.getElementById("edit-email").value.trim();
        let education = document.getElementById("edit-education").value.trim();

        // Vérifications des champs
        const nameRegex = /^[a-zA-ZÀ-ÿ' -]{1,50}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!nameRegex.test(firstName)) {
            alert("Prénom invalide");
            return;
        }
        if (!nameRegex.test(lastName)) {
            alert("Nom invalide");
            return;
        }
        if (!emailRegex.test(email)) {
            alert("Email invalide");
            return;
        }
        if (education.length > 100) {
            alert("Le champ d'éducation est trop long");
            return;
        }

        // Protection contre les attaques XSS (échapper les entrées)
        function sanitize(input) {
            return input.replace(/[&<>'"/]/g, function (c) {
                return {'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;', '/': '&#x2F;'}[c];
            });
        }

        firstName = sanitize(firstName);
        lastName = sanitize(lastName);
        email = sanitize(email);
        education = sanitize(education);

        // Mise à jour des données utilisateur sécurisées
        userProfile.firstName = firstName;
        userProfile.lastName = lastName;
        userProfile.email = email;
        userProfile.education = education;

        // Envoi sécurisé des informations
        setUserInfo(user_id, "name", firstName);
        setUserInfo(user_id, "surname", lastName);
        setUserInfo(user_id, "email", email);
        setUserInfo(user_id, "niveauEtudes", education);

        updateProfile(); // Met à jour l'affichage du profil

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

