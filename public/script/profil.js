document.addEventListener("DOMContentLoaded", function () {
    // Données fictives pour le profil
    const userProfile = {
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@example.com",
        education: "Master en Informatique",
        courses: ["Développement Web", "IA & Machine Learning"],
        mentorships: 5,
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
        annoncesProposees: [
            { title: "Cours de Python - Niveau Débutant", description: "Apprenez les bases du langage Python.", image: "./img/Prof1.jpg" },
            { title: "Introduction au Machine Learning", description: "Une introduction aux concepts de Machine Learning.", image: "./img/Prof1.jpg" },
            { title: "Aide pour un projet JavaScript", description: "Besoin d'aide pour votre projet JavaScript ?", image: "./img/Prof1.jpg" }
        ],
        annoncesRecherchees: [
            { title: "Besoin d'un mentor en Data Science", description: "Je cherche un mentor en Data Science.", image: "./img/Prof1.jpg" },
            { title: "Cours avancé en React.js", description: "Cours avancé sur React.js.", image: "./img/Prof1.jpg" },
            { title: "Aide pour un projet en Cybersécurité", description: "Aide pour un projet lié à la cybersécurité.", image: "./img/Prof1.jpg" }
        ]
    };

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
        alert("Le compte a été supprimé.");
        window.location.href = "/home"; // Simuler la suppression et redirection
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

