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
	


//on récupère les infos renseignés	
function getFormData() {
    const subject = document.getElementById("subject-input").value;
    const question = document.getElementById("question").value;
    const exerciseType = document.querySelector('input[name="exercice"]:checked')?.value || "sansexercice";

    return { subject, question, exerciseType };
}

function generatePrompt({ subject, question, exerciseType }) {
    return `Sujet : ${subject}\nQuestion : ${question}\nExercice : ${exerciseType}\n\nPeux-tu répondre à cette question et proposer un exercice correspondant au niveau demandé ?`;
}

function validateForm() {
    const subject = document.getElementById("subject-input").value.trim();
    const question = document.getElementById("question").value.trim();
    const exerciseType = document.querySelector('input[name="exercice"]:checked');

    if (!subject || !question || !exerciseType) {
        alert("Veuillez remplir tous les champs avant d'envoyer votre demande.");
        return false;
    }
    return true;
}



async function generateAnswer() {
    if (!validateForm()) return; // Stoppe l'exécution si le formulaire est incomplet

    const formData = getFormData();
    const prompt = generatePrompt(formData);

    try {
        document.getElementById("answer").innerHTML = "<p>Chargement...</p>";
        const responseText = await getAIResponse(prompt);
        document.getElementById("answer").innerHTML = `<p>${responseText}</p>`;
    } catch (error) {
        document.getElementById("answer").innerHTML = "<p>Une erreur est survenue. Veuillez réessayer.</p>";
        console.error("Erreur API :", error);
    }
}

document.querySelector(".btn").addEventListener("click", generateAnswer);

function updateButtonState() {
    const btn = document.querySelector(".btn");
    btn.disabled = !validateForm();
}

document.getElementById("subject-input").addEventListener("input", updateButtonState);
document.getElementById("question").addEventListener("input", updateButtonState);
document.querySelectorAll('input[name="exercice"]').forEach(input => 
    input.addEventListener("change", updateButtonState)
);


//----------------------------------<<<API Gemini>>>-------------------------------------

require('dotenv').config();
const geminiRoutes = require('./backend/gemini');
app.use('/api/gemini', geminiRoutes);
