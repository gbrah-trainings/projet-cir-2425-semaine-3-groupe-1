// Lire le cookie et voir si on est connecté
const storedUserData = localStorage.getItem('user');
if(!storedUserData) window.location.href = "login.html";

function addAvailability() {
    const day = document.getElementById('availability-day').value;
    const start = document.getElementById('availability-start').value;
    const end = document.getElementById('availability-end').value;
    const modes = Array.from(document.querySelectorAll('.availability-modes input:checked'))
        .map(input => input.value);

    // Validation de base
    if (!day || !start || !end || modes.length === 0) {
        alert("Veuillez remplir tous les champs pour ajouter une disponibilité.");
        return;
    }

    // Création d'un post-it pour les disponibilités
    const availabilityList = document.getElementById('availability-list-container');
    const availabilityItem = document.createElement('div');
    availabilityItem.className = 'availability-item';

    // Formatage du texte du post-it
    const availabilityText = document.createElement('span');
    availabilityText.textContent = `Le ${day} de ${start} à ${end} (${modes.join(", ")})`;

    // Bouton de suppression
    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Supprimer";
    deleteButton.onclick = () => {
        availabilityItem.classList.add('removing');
        setTimeout(() => {
            availabilityItem.remove();
        }, 500);
    };

    // Ajout des éléments au post-it
    availabilityItem.appendChild(availabilityText);
    availabilityItem.appendChild(deleteButton);
    availabilityList.appendChild(availabilityItem);

    // Réinitialisation du formulaire
    document.getElementById('availability-day').value = '';
    document.getElementById('availability-start').value = '';
    document.getElementById('availability-end').value = '';
    document.querySelectorAll('.availability-modes input').forEach(input => input.checked = false);
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
    list.innerHTML = ''; 

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



//-----------Serveur POST-------------

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('btn_submit').addEventListener('click', function () {

        // Récupérer le rôle (mentor ou apprenant)
        const role = document.querySelector('input[name="role"]:checked')?.value;

        // Récupérer les matières sélectionnées
        const subjects = Array.from(document.querySelectorAll('.subject-item span'))
            .map(subject => subject.textContent);

        // Récupérer l'adresse du cours (peut être vide)
        const address = document.getElementById('address').value.trim();

        // Récupérer la description du cours (peut être vide)
        const description = document.getElementById('description').value.trim();


        // Récupérer la date de début
        const startDate = document.getElementById('start-date').value;

        // Récupérer les disponibilités
        const availabilityItems = document.querySelectorAll('.availability-item span');

        // Séparation des disponibilités
        const schedules = [];      
        const onlineMeetings = []; 
        const irlMeetings = [];    

        availabilityItems.forEach(item => {
            const text = item.textContent.toLowerCase();

            // Extraire les informations
            const scheduleMatch = text.match(/le (.*?) de (.*?) à (.*?) (.*)/i);
            if (scheduleMatch) {
                const [, day, start, end, type] = scheduleMatch;
                schedules.push({ day, start, end });

                if (type.includes("en ligne") || type.includes("distanciel")) {
                    onlineMeetings.push({ day, start, end });
                }

                if (type.includes("présentiel") || type.includes("chez vous")) {
                    irlMeetings.push({ day, start, end });
                }
            }
        });
        

        // Vérification des champs obligatoires
        if (!role || subjects.length === 0 || !startDate || schedules.length === 0) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        // Création de l'objet à envoyer
        const requestData = {
            role,
            subjects,
            address,
            description,  
            startDate,
            availabilities: schedules, 
            onlineMeetings,
            irlMeetings
        };
        

        // Envoi des données via une requête POST
        fetch('/submitAnnonce', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Erreur : " + data.error);
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert("Une erreur est survenue, veuillez réessayer.");
        });
        
    });
});