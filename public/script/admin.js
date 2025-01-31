async function getUserInfo(userID, parametre) {
    const response = await fetch(`/getUser/${userID}?parametre=${parametre}`);
    const data = await response.json();
    return data;

}   


// Vérifier si l'utilisateur est bien administrateur.
const storedUserData = localStorage.getItem('user');

if (storedUserData) {
    const userData = JSON.parse(storedUserData);
    user_id = userData.id
} else {
    // S'il n'est même pas connecté, ce n'est même pas la peine !
    window.location.href = "index.html"
}

document.addEventListener("DOMContentLoaded", async function () {
        
    // Déjà, un utilisateur est connecté, bon. Est-il seulement admin ?
    const check_admin = await getUserInfo(user_id, 'isAdmin');

    if (!check_admin.isAdmin) window.location.href = "index.html"; // Si non, c'est ciao

    const stats = {
        visiteurs: 1243,
        inscrits: 1100,
        coursSuivis: 5495,
        messages: 1293,
        rdv: 127
    };

    function updateStats() {
        document.querySelector(".stats p:nth-child(2)").textContent = `${stats.visiteurs} visiteurs aujourd’hui`;
        document.querySelector(".stats p:nth-child(3)").textContent = `${stats.inscrits} utilisateurs inscrits`;
        document.querySelector(".stats p:nth-child(4)").textContent = `${stats.coursSuivis} cours suivis`;
        document.querySelector(".stats p:nth-child(5)").textContent = `${stats.messages} messages échangés`;
        document.querySelector(".stats p:nth-child(6)").textContent = `${stats.rdv} rendez-vous à venir`;
    }

    updateStats();

    document.querySelector(".stats input").addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            alert(`Nouvel administrateur ajouté : ${this.value}`);
            this.value = "";
        }
    });

    const topUsers = {
        actif: { nom: "Didier", ville: "Lille", image: "Robin.jpg" }, // utilisateur le plus actif (nb de messages)
        prof1: { nom: "Didier", ville: "Lille", image: "Robin.jpg" }, // prof top1 du nb de cours
        prof2: { nom: "Pascal", ville: "La Madeleine" },              // prof top2 du nb de cours
        prof3: { nom: "Christian", ville: "Youpi-sur-mer" }           // prof top3 du nb de cours
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

            // Supprimer le compte de l'utilsateur concerné.

            const userInput = prompt("Pour confirmer la suppression, veuillez entrer SUPPRIMER en majuscules :");
            if (userInput === "SUPPRIMER") {
                alert("Suppression confirmée. L'élément sera supprimé.");
                // Ajouter ici le code pour effectuer la suppression
                // TODO

                this.parentElement.remove();
                return true;
            } else {
                alert("Suppression annulée.");
                return false;
            }
            

        });
    });
});
