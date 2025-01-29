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

// Fonction pour mettre à jour le champ caché avant la soumission
function updateHiddenInput() {
  const selectedSubjects = Array.from(subjectsContainer.children).map(postit => 
      postit.querySelector("span").textContent
  );

  document.getElementById("hidden-teaching-subject").value = JSON.stringify(selectedSubjects);
}


/* --------- Form submit ------------------------------------------------------------------- */

const form = document.getElementById('inscriptionForm');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // Empêche le rechargement de la page

      updateHiddenInput();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      try {
        const response = await fetch('/inscriptionSubmit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });


        if (response) {
          const message = await response.json();
          
          if(message.error){
            resultDiv.className = "error";
            resultDiv.textContent = message.error;
          } else {
            resultDiv.className = "success";
            resultDiv.textContent = 'Inscription réussie !';
                  
          }
        }
      } catch (error) {
        resultDiv.textContent = 'Une erreur est survenue. Veuillez réessayer dans quelques instants.';
      }
    });
function removePostit(postit) {
    console.log("Ajout de la classe 'removing'");
    postit.classList.add('removing'); // Ajoute la classe avec l'animation CSS
    postit.addEventListener('animationend', () => {
        console.log("Animation terminée. Suppression de l'élément.");
        postit.remove(); // Supprime le post-it une fois l'animation terminée
        updateHiddenInput();
    });
}

// Fonction existante : ajout des sujets
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
    removeBtn.setAttribute("type", "button"); // Ajoute cette ligne !
    removeBtn.addEventListener("click", () => {
        removePostit(postit); // Inclut l'animation de suppression
        updateHiddenInput();
    });
    
    postit.appendChild(subjectName);
    postit.appendChild(removeBtn);
    subjectsContainer.appendChild(postit);
    updateHiddenInput();
}

function removePostit(postit) {
    console.log("Ajout de la classe 'removing'");
    postit.classList.add('removing'); // Ajoute la classe avec l'animation CSS
    postit.addEventListener('animationend', () => {
        console.log("Animation terminée. Suppression de l'élément.");
        postit.remove(); // Supprime le post-it une fois l'animation terminée
    });
}

// Fonction existante : ajout des sujets
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
    removeBtn.setAttribute("type", "button"); // Ajoute cette ligne !
    removeBtn.addEventListener("click", () => {
        removePostit(postit); // Inclut l'animation de suppression
    });
    
    postit.appendChild(subjectName);
    postit.appendChild(removeBtn);
    subjectsContainer.appendChild(postit);
}

function removePostit(postit) {
    console.log("Ajout de la classe 'removing'");
    postit.classList.add('removing'); // Ajoute la classe avec l'animation CSS
    postit.addEventListener('animationend', () => {
        console.log("Animation terminée. Suppression de l'élément.");
        postit.remove(); // Supprime le post-it une fois l'animation terminée
    });
}

// Fonction existante : ajout des sujets
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
    removeBtn.setAttribute("type", "button"); // Ajoute cette ligne !
    removeBtn.addEventListener("click", () => {
        removePostit(postit); // Inclut l'animation de suppression
    });
    
    postit.appendChild(subjectName);
    postit.appendChild(removeBtn);
    subjectsContainer.appendChild(postit);
}





