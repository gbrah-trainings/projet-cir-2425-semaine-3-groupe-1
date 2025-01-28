

const subjects = ["Mathématiques", "Sciences", "Informatique", "Français", "Anglais", "Physique", "Chimie", "Biologie", "Histoire", "Géographie"];
const subjectInput = document.getElementById("teaching-subject");
const autocompleteList = document.getElementById("autocomplete-list");
const subjectsContainer = document.getElementById("subjects-container");

subjectInput.addEventListener("input", function () {
    const input = this.value.toLowerCase();
    autocompleteList.innerHTML = ""; 
    if (input) {
        const filteredSubjects = subjects.filter(subject => subject.toLowerCase().includes(input));
        filteredSubjects.forEach(subject => {
            const item = document.createElement("div");
            item.textContent = subject;
            item.classList.add("autocomplete-item");
            item.addEventListener("click", () => {
                addSubject(subject); 
                subjectInput.value = ""; 
                autocompleteList.innerHTML = ""; 
            });
            autocompleteList.appendChild(item);
        });
    }
});

document.addEventListener("click", function (e) {
    if (!autocompleteList.contains(e.target) && e.target !== subjectInput) {
        autocompleteList.innerHTML = ""; 
    }
});

function addSubject(subject) {
    const existingSubjects = Array.from(subjectsContainer.children).map(postit => 
        postit.querySelector("span").textContent
    );
    
    if (existingSubjects.includes(subject)) {
        alert(`La matière "${subject}" est déjà ajoutée !`);
        return;
    }

    const postit = document.createElement("div");
    postit.classList.add("subject-postit");

    const subjectName = document.createElement("span");
    subjectName.textContent = subject;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.classList.add("remove-btn");
    removeBtn.addEventListener("click", () => {
        postit.remove(); 
    });

    postit.appendChild(subjectName);
    postit.appendChild(removeBtn);
    subjectsContainer.appendChild(postit);
}
