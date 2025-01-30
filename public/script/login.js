// On déconnecte l'utilisateur s'il arrive sur cette page.
localStorage.clear();

/* --------- Form submit ------------------------------------------------------------------- */

const form = document.getElementById('loginForm');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // Empêche le rechargement de la page

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);


      try {
        const response = await fetch('/loginSubmit', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
            const message = await response.json();
            
            if (message.error) {
                resultDiv.className = "error";
                resultDiv.textContent = message.error;
            } else {
                resultDiv.className = "success";
                resultDiv.textContent = message.message;

                localStorage.setItem('user', JSON.stringify(message.user));
    
                window.location.href = "./index.html";
            }
        } else {
            resultDiv.className = "error";
            resultDiv.textContent = "Erreur lors de la connexion.";
        }

      } catch (error) {
        resultDiv.className = 'error';
        resultDiv.textContent = 'Une erreur est survenue. Veuillez réessayer dans quelques instants.';
      }

    });