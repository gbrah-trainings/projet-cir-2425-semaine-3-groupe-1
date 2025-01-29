function addAvailability() {
    const day = document.getElementById('availability-day').value;
    const start = document.getElementById('availability-start').value;
    const end = document.getElementById('availability-end').value;
    const type = document.getElementById('availability-type').value;

    // Validation de base
    if (!day || !start || !end || !type) {
        alert("Veuillez remplir tous les champs pour ajouter une disponibilité.");
        return;
    }

    // Création d'un post-it pour les disponibilités
    const availabilityList = document.getElementById('availability-list-container');
    const availabilityItem = document.createElement('div');
    availabilityItem.className = 'availability-item';

    // Formatage du texte du post-it
    const availabilityText = document.createElement('span');

    // Si le type est "chez vous", ne pas ajouter "en" devant
    const typeText = (type === "chez vous") ? type : `en ${type}`;

    availabilityText.textContent = `Le ${day} de ${start} à ${end} ${typeText}`;

    // Bouton de suppression
    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Supprimer";
    
    // Ajout de l'animation de suppression avant de retirer l'élément
    deleteButton.onclick = () => {
        availabilityItem.classList.add('removing');  // Ajouter la classe "removing" pour démarrer l'animation
        setTimeout(() => {
            availabilityItem.remove();  // Supprimer l'élément après l'animation
        }, 500);  // Délai de 500ms pour laisser l'animation se dérouler avant la suppression
    };

    // Ajout des éléments au post-it
    availabilityItem.appendChild(availabilityText);
    availabilityItem.appendChild(deleteButton);
    availabilityList.appendChild(availabilityItem);

    // Réinitialisation du formulaire
    document.getElementById('availability-day').value = '';
    document.getElementById('availability-start').value = '';
    document.getElementById('availability-end').value = '';
    document.getElementById('availability-type').value = '';
}





// Liste des matières disponibles
const subjects = [
    "Mathématiques", "Physique", "Chimie", "Biologie",
    "Anglais", "Français", "Histoire", "Géographie",
    "Informatique", "Programmation", "Musique", "Arts"
];

// Fonction pour filtrer les matières dans la liste déroulante
function filterSubjects() {
    const input = document.getElementById('subject-input');
    const filter = input.value.toLowerCase();
    const list = document.getElementById('subject-list');
    list.innerHTML = ''; // Clear previous suggestions

    // Ajouter les matières correspondant à la recherche
    subjects.forEach(subject => {
        if (subject.toLowerCase().includes(filter)) {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.textContent = subject;
            item.onclick = () => {
                input.value = subject; // Remplir le champ de texte
                list.innerHTML = ''; // Effacer les suggestions
            };
            list.appendChild(item);
        }
    });
}

// Fonction pour ajouter une matière sous forme de post-it
function addSubject() {
    const input = document.getElementById('subject-input');
    const subject = input.value.trim();
    if (!subject) return; // Ne rien faire si l'entrée est vide

    // Vérifier si la matière est déjà ajoutée
    const subjectList = document.getElementById('subject-list-container');
    const existingSubjects = Array.from(subjectList.children).map(item =>
        item.querySelector('span').textContent
    );
    if (existingSubjects.includes(subject)) {
        alert("Cette matière est déjà ajoutée.");
        return;
    }

    // Créer un post-it pour la matière
    const subjectItem = document.createElement('div');
    subjectItem.className = 'subject-item adding'; // Ajouter la classe "adding" pour démarrer l'animation

    const subjectName = document.createElement('span');
    subjectName.textContent = subject;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = "×";
    deleteButton.onclick = () => {
        subjectItem.classList.add('removing');  // Ajouter la classe "removing" pour démarrer l'animation de suppression
        setTimeout(() => {
            subjectItem.remove();  // Supprimer l'élément après l'animation
        }, 500);  // Délai de 500ms pour laisser l'animation de suppression se dérouler avant la suppression
    };

    subjectItem.appendChild(subjectName);
    subjectItem.appendChild(deleteButton);
    subjectList.appendChild(subjectItem);

    // Réinitialiser le champ d'entrée
    input.value = '';
}





document.getElementById('radius-enable').addEventListener('change', function () {
    const radiusInput = document.getElementById('radius-input');
    radiusInput.disabled = !this.checked;
});

// Initialisation : désactive le champ par défaut
document.getElementById('radius-input').disabled = true;

// Ajoutez un écouteur d'événements pour gérer la sélection du checkbox
document.getElementById('radius-enable').addEventListener('change', function () {
    const radiusInput = document.getElementById('radius-input');
    
    // Active ou désactive le champ en fonction de l'état du checkbox
    if (this.checked) {
        radiusInput.disabled = false;
    } else {
        radiusInput.disabled = true;
        radiusInput.value = ''; // Réinitialise la valeur du rayon si désélectionné
    }
});

// Initialisation : désactive le champ par défaut
document.getElementById('radius-input').disabled = true;


