function updateHeader() {
    const storedUserData = localStorage.getItem('user');
    if(storedUserData){
        const userData = JSON.parse(storedUserData);
        console.log(userData);
        const navList = document.querySelector('.header-nav');
        if (navList) {
            const newListItem = document.createElement('li');
            const newLink = document.createElement('a');
            newLink.href = 'profil.html';
            newLink.className = 'header-link';
            newLink.textContent = 'Espace personnel';
            newListItem.appendChild(newLink);
            navList.appendChild(newListItem);
        }
    } else {
        const headerNav = document.querySelector('.header-nav');
        if (headerNav) {
            const newListItem = document.createElement('li');
            const newLink = document.createElement('a');
            newLink.href = 'inscription.html';
            newLink.className = 'header-link';
            newLink.textContent = 'Inscription';
            newListItem.appendChild(newLink);
            headerNav.appendChild(newListItem);
        } else {
            console.error('Header nav not found');
        }
    }
}

fetch('/assets/header.html')
    .then(response => response.text())
    .then(html => {
        document.getElementsByTagName('header')[0].innerHTML = html;
        updateHeader(); // Appel de la fonction après le chargement du header
    });

fetch('/assets/footer.html')
    .then(response => response.text())
    .then(html => document.getElementsByTagName('footer')[0].innerHTML = html);

document.addEventListener('DOMContentLoaded', function() {
    // Le reste du code qui ne dépend pas du contenu chargé dynamiquement
});
