const mentorsData = [
    { name: "Didier", subject: "Techno", image: "./img/Prof1.jpg", category: "science" },
    { name: "Bertrand", subject: "Physique", image: "./img/Prof2.png", category: "science" },
    { name: "Patrick", subject: "Maths", image: "./img/Prof1.jpg", category: "math" },
    { name: "Bélatrice", subject: "Français", image: "./img/Prof1.jpg", category: "langues" },
    { name: "Juliette", subject: "Anglais", image: "./img/Prof1.jpg", category: "langues" }
];

const studentsData = [
    { name: "Sarah", subject: "Physique", image: "./img/Prof1.jpg", category: "science" },
    { name: "Lucas", subject: "Maths", image: "./img/Prof2.png", category: "math" },
    { name: "Nina", subject: "Informatique", image: "./img/Prof1.jpg", category: "informatique" },
    { name: "Mickaël", subject: "Chimie", image: "./img/Prof2.png", category: "science" },
    { name: "Claire", subject: "Biologie", image: "./img/Prof1.jpg", category: "science" }
];

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




