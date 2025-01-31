async function getUserInfo(userID, parametre) {
    const response = await fetch(`/getUser/${userID}?parametre=${parametre}`);
    const data = await response.json();
    return data;
}

async function setUserInfo(userID, parametre, valeur) {
    try {
        const response = await fetch(`/updateUser/${userID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ parametre, valeur })
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || "Erreur inconnue");
        }

        console.log("✅ Mise à jour réussie :", result.message);
        return result; // Retourne la réponse en JSON
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour :", error);
        return { error: error.message };
    }
}

async function doesAccountExist(email) {
    const response = await fetch(`/doesAccountExist/${email}`);
    const data = await response.json();
    return data;
}


const storedUserData = localStorage.getItem('user');
if (!storedUserData) {
    window.location.href = "index.html";
}

const userData = JSON.parse(storedUserData);
const user_id = userData.id;

document.addEventListener("DOMContentLoaded", async function () {
    const check_admin = await getUserInfo(user_id, 'isAdmin');
    if (!check_admin.isAdmin) window.location.href = "index.html";

    // Récupérer le nombre d'inscrits


    // coursSuivis

    
    // annonces


    // messages : à faire plus tard


    const stats = {
        inscrits: 1100,
        coursSuivis: 5495,
        annonces: 5495,
        messages: 12943
    };

    function updateStats() {
        const statElements = document.querySelectorAll(".stats p");
        statElements[0].textContent = `${stats.inscrits} utilisateurs inscrits`;
        statElements[1].textContent = `${stats.coursSuivis} recherches publiées`;
        statElements[2].textContent = `${stats.annonces} annonces de cours proposées`;
        statElements[3].textContent = `${stats.messages} messages échangés`;
    }

    updateStats();

    document.querySelector(".stats input").addEventListener("keypress", async function (e) {
        if (e.key === "Enter") {
            
            const email = this.value.trim();
            
            if (!email || !email.includes("@") || !email.includes(".")) {
                alert("Adresse e-mail invalide");
                return;
            }
    
            const accountExists = await doesAccountExist(email);
            if (!accountExists.exists) {
                alert("Aucun compte trouvé avec cette adresse e-mail");
                return;
            }

            const updateResult = await setUserInfo(accountExists.userID, 'isAdmin', true);
            if (!updateResult.error) {
                alert(`Nouvel administrateur ajouté : ${email}`);
                this.value = "";
            } else {
                alert("Erreur lors de l'ajout de l'administrateur");
            }
            
        }
    });
    
    

    const topUsers = {
        actif: { nom: "Didier", ville: "Lille", image: "Robin.jpg" },
        prof1: { nom: "Didier", ville: "Lille", image: "Robin.jpg" },
        prof2: { nom: "Pascal", ville: "La Madeleine" },
        prof3: { nom: "Christian", ville: "Youpi-sur-mer" }
    };

    function updateTopUsers() {
        document.querySelector(".active-user .mentor-info strong").textContent = topUsers.actif.nom;
        document.querySelector(".active-user .mentor-info i").textContent = topUsers.actif.ville;
        document.querySelector(".active-user img").src = topUsers.actif.image;

        document.querySelector(".top-prof .mentor-info strong").textContent = topUsers.prof1.nom;
        document.querySelector(".top-prof .mentor-info i").textContent = topUsers.prof1.ville;
        document.querySelector(".top-prof img").src = topUsers.prof1.image;

        document.querySelector(".top-prof + p").innerHTML = `2e : <strong>${topUsers.prof2.nom}</strong>, ${topUsers.prof2.ville}`;
        document.querySelector(".top-prof + p + p").innerHTML = `3e : <strong>${topUsers.prof3.nom}</strong>, ${topUsers.prof3.ville}`;
    }

    updateTopUsers();

    document.querySelectorAll(".delete").forEach(button => {
        button.addEventListener("click", function () {
            const userInput = prompt("Pour confirmer la suppression, veuillez entrer SUPPRIMER en majuscules :");
            if (userInput === "SUPPRIMER") {
                alert("Suppression confirmée. L'élément sera supprimé.");
                this.parentElement.remove();
            } else {
                alert("Suppression annulée.");
            }
        });
    });
});
