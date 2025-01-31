function updateHeader() {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
        const navList = document.querySelector('.header-nav');
        if (navList) {
            let newListItem = document.createElement('li');
            let newLink = document.createElement('a');
            newLink.href = 'edit_profil.html';
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

async function updateUserNav() {
    const storedUserData = localStorage.getItem('user');
    if (!storedUserData) return;

    try {
        const userData = JSON.parse(storedUserData);
        if (!userData || !userData.id) return;
        
        const user_id = userData.id;
        const navList = document.querySelector('.header-nav');
        if (!navList) return;
        
        const check_admin = await getUserInfo(user_id, 'isAdmin');

        if (check_admin.isAdmin) {
            let adminItem = document.createElement('li');
            let adminLink = document.createElement('a');
            adminLink.href = 'admin.html';
            adminLink.className = 'header-link';
            adminLink.textContent = 'Espace Admin';
            adminItem.appendChild(adminLink);
            navList.appendChild(adminItem);
        }

        let logoutItem = document.createElement('li');
        let logoutLink = document.createElement('a');
        logoutLink.href = 'login.html';
        logoutLink.className = 'header-link';
        logoutLink.textContent = 'Déconnexion';
        logoutItem.appendChild(logoutLink);
        navList.appendChild(logoutItem);

    } catch (error) {
        console.error('Erreur lors de la récupération des infos utilisateur:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('/assets/header.html')
        .then(response => response.text())
        .then(html => {
            document.getElementsByTagName('header')[0].innerHTML = html;
            updateHeader();
            updateUserNav(); // Exécuter après l'insertion du header
        });

    fetch('/assets/footer.html')
        .then(response => response.text())
        .then(html => {
            document.getElementsByTagName('footer')[0].innerHTML = html;
        });
});
