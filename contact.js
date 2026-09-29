(function() {
    emailjs.init("g13sDeGEMXbQEy26u");
})();

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Vérifier que tous les champs sont remplis
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value.trim();
    const message = document.getElementById('message').value.trim();
    const checkbox = document.querySelector('input[type="checkbox"]');

    // Validation des champs
    if (!name || !email || !service || !message || !checkbox.checked) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'p-4 mb-4 text-red-700 bg-red-100 rounded';
        errorMessage.innerHTML = 'Veuillez remplir tous les champs et accepter les conditions.';
        const submitButton = this.querySelector('button[type="submit"]');
        document.getElementById('contactForm').insertBefore(errorMessage, submitButton);
        return;
    }

    // Afficher un indicateur de chargement
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> Envoi en cours...';
    submitButton.disabled = true;

    // Préparer les paramètres
    const templateParams = {
        name: name,
        email: email,
        service: service,
        message: message
    };

    // TODO: Remplacer TEMPLATE_ID par l'ID de votre template
    // Vous pouvez le trouver dans : Email Templates > Votre Template > Template ID
    emailjs.send('service_t7ul44r', 'template_llbo6lr', templateParams)
        .then(function(response) {
            // Succès
            submitButton.innerHTML = '<i class="ri-check-line"></i> Message envoyé !';
            submitButton.classList.remove('bg-primary');
            submitButton.classList.add('bg-green-600');
            
            // Réinitialiser le formulaire
            document.getElementById('contactForm').reset();
            
            // Afficher un message de succès
            const successMessage = document.createElement('div');
            successMessage.className = 'p-4 mb-4 text-green-700 bg-green-100 rounded';
            successMessage.innerHTML = 'Merci pour votre message ! Je vous répondrai dans les plus brefs délais.';
            document.getElementById('contactForm').insertBefore(successMessage, submitButton);

            // Restaurer le bouton après 3 secondes
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.classList.remove('bg-green-600');
                submitButton.classList.add('bg-primary');
                submitButton.disabled = false;
                // Supprimer le message de succès
                if (successMessage.parentNode) {
                    successMessage.parentNode.removeChild(successMessage);
                }
            }, 3000);
        })
        .catch(function(error) {
            console.error('Erreur EmailJS:', error);
            // Erreur
            submitButton.innerHTML = '<i class="ri-error-warning-line"></i> Erreur';
            submitButton.classList.remove('bg-primary');
            submitButton.classList.add('bg-red-600');
            
            // Afficher un message d'erreur
            const errorMessage = document.createElement('div');
            errorMessage.className = 'p-4 mb-4 text-red-700 bg-red-100 rounded';
            errorMessage.innerHTML = 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.';
            document.getElementById('contactForm').insertBefore(errorMessage, submitButton);

            // Restaurer le bouton après 3 secondes
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.classList.remove('bg-red-600');
                submitButton.classList.add('bg-primary');
                submitButton.disabled = false;
                // Supprimer le message d'erreur
                if (errorMessage.parentNode) {
                    errorMessage.parentNode.removeChild(errorMessage);
                }
            }, 3000);
        });
}); 