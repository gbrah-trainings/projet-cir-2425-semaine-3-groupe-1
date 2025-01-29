
const subjects = [
    "Mathématiques", "Physique", "Chimie", "Biologie",
    "Anglais", "Français", "Histoire", "Géographie",
    "Informatique", "Programmation", "Musique", "Arts"
];


function filterSubjects() {
    const input = document.getElementById('subject-input');
    const filter = input.value.toLowerCase();
    const list = document.getElementById('subject-list');
    list.innerHTML = ''; 


    subjects.forEach(subject => {
        if (subject.toLowerCase().includes(filter)) {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.textContent = subject;
            item.onclick = () => {
                input.value = subject; 
                list.innerHTML = '';
            };
            list.appendChild(item);
        }
    });
}


function addSubject() {
    const input = document.getElementById('subject-input');
    const subject = input.value.trim();
    if (!subject) return; 

 
    const subjectList = document.getElementById('subject-list-container');
    const existingSubjects = Array.from(subjectList.children).map(item =>
        item.querySelector('span').textContent
    );
    if (existingSubjects.includes(subject)) {
        alert("Cette matière est déjà ajoutée.");
        return;
    }


    const subjectItem = document.createElement('div');
    subjectItem.className = 'subject-item adding'; 

    const subjectName = document.createElement('span');
    subjectName.textContent = subject;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = "×";
    deleteButton.onclick = () => {
        subjectItem.classList.add('removing'); 
        setTimeout(() => {
            subjectItem.remove();  
        }, 500);  
    };

    subjectItem.appendChild(subjectName);
    subjectItem.appendChild(deleteButton);
    subjectList.appendChild(subjectItem);


    input.value = '';
}

document.getElementById('radius-enable').addEventListener('change', function () {
    const radiusInput = document.getElementById('radius-input');
    radiusInput.disabled = !this.checked;
});


document.getElementById('radius-input').disabled = true;


document.getElementById('radius-enable').addEventListener('change', function () {
    const radiusInput = document.getElementById('radius-input');
    

    if (this.checked) {
        radiusInput.disabled = false;
    } else {
        radiusInput.disabled = true;
        radiusInput.value = ''; 
    }
});

document.getElementById('radius-input').disabled = true;


