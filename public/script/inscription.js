const subjects = ["Mathématiques", "Sciences", "Informatique", "Français", "Anglais", "Physique", "Chimie", "Biologie", "Histoire", "Géographie"];
const subjectInput = document.getElementById("teaching-subject");
const autocompleteList = document.getElementById("autocomplete-list");

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
                subjectInput.value = subject; 
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
