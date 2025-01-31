const storedUserData = localStorage.getItem('user');
if(!storedUserData) window.location.href = "login.html";

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






async function generateAnswer() {
    const subjectList = document.getElementById('subject-list-container');
    const selectedSubjects = Array.from(subjectList.children).map(item =>
        item.querySelector('span').textContent
    );

    const question = document.getElementById('question').value;
    const exerciceType = document.querySelector('input[name="exercice"]:checked')?.value || 'sansexercice'; // Récupérer le type d'exercice sélectionné

    // Construction du prompt (plus complet)
    const prompt = `Matières : ${selectedSubjects.join(', ')} Question : ${question} Type d'exercice : ${exerciceType} `;
	console.log("URL de la requête :", '/api/gemini/generate');
	console.log("Corps de la requête :", JSON.stringify({ prompt }));
    try {
        const response = await fetch('/api/gemini/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
			
        });
		
		console.log("le fetch:", response);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de la génération de la réponse.');
        }

        const data = await response.json();
        const answerDiv = document.getElementById('answer');
        answerDiv.innerHTML = data.response; // Utiliser innerHTML pour permettre le HTML dans la réponse

    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Gemini :", error);
        alert(error.message);
    }
}


// Activer le bouton "Envoyer à l'IA" seulement si une question est posée et au moins une matière est sélectionnée
const questionInput = document.getElementById('question');
const sendButton = document.querySelector('.btn[onclick="generateAnswer()"]'); // Sélectionner le bouton par son attribut onclick

questionInput.addEventListener('input', () => {
    const hasQuestion = questionInput.value.trim() !== '';
    const hasSubjects = document.getElementById('subject-list-container').children.length > 0;
    sendButton.disabled = !(hasQuestion && hasSubjects);
});

// Écouter les changements dans la liste des matières
const subjectListContainer = document.getElementById('subject-list-container');
subjectListContainer.addEventListener('DOMNodeInserted', () => {
    const hasQuestion = questionInput.value.trim() !== '';
    const hasSubjects = subjectListContainer.children.length > 0;
    sendButton.disabled = !(hasQuestion && hasSubjects);
});

subjectListContainer.addEventListener('DOMNodeRemoved', () => {
    const hasQuestion = questionInput.value.trim() !== '';
    const hasSubjects = subjectListContainer.children.length > 0;
    sendButton.disabled = !(hasQuestion && hasSubjects);
});






async function generatePDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Convertir la section en image
            const content = document.getElementById("content");
            const canvas = await html2canvas(answer);
            const imgData = canvas.toDataURL("image/png");

            // Ajouter l'image au PDF
            doc.addImage(imgData, 'PNG', 10, 10, 180, 0);
            doc.save("réponse.pdf");
}
	