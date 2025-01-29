const bcrypt = require('bcrypt');


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

      } catch (error) {
        resultDiv.textContent = 'Une erreur est survenue. Veuillez réessayer dans quelques instants.';
      }
    });