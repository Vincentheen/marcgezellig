// Charger les variables d'environnement
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
const { Webhook } = require('discord-webhook-node');
const { notificationConfig, publicConfig } = require('./config');
const axios = require('axios');

// Log les variables d'environnement (en masquant les parties sensibles)
console.log('Configuration chargée:');
console.log('PAYPAL_CLIENT_ID:', process.env.PAYPAL_CLIENT_ID ? 'Définie' : 'Non définie');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static(__dirname));

// Configuration des notifications
const transporter = nodemailer.createTransport(notificationConfig.email);
const hook = new Webhook(notificationConfig.discord.webhookUrl);

// Fonction pour envoyer un email via EmailJS
async function sendEmailJS(templateId, templateParams) {
    try {
        console.log('Tentative d\'envoi d\'email avec EmailJS:', {
            serviceId: publicConfig.emailjs.serviceId,
            templateId: templateId,
            templateParams: templateParams
        });

        const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
            service_id: publicConfig.emailjs.serviceId,
            template_id: templateId,
            user_id: publicConfig.emailjs.userId,
            template_params: templateParams,
            accessToken: process.env.EMAILJS_ACCESS_TOKEN
        });

        console.log('Email envoyé avec succès');
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error.response ? error.response.data : error);
        throw error;
    }
}

// Route pour vérifier un paiement PayPal
app.post('/verify-paypal-payment', async (req, res) => {
    try {
        const { orderID } = req.body;
        
        if (!orderID) {
            return res.status(400).json({ error: 'OrderID manquant' });
        }
        
        // Ici, vous devriez implémenter la vérification du paiement PayPal
        // en utilisant l'API PayPal pour vérifier que le paiement est valide
        
        res.json({ success: true });
    } catch (error) {
        console.error('Erreur vérification PayPal:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route pour obtenir la configuration du client
app.get('/config', (req, res) => {
    res.json({
        paypalClientId: process.env.PAYPAL_CLIENT_ID
    });
});

// Soumission d'un devis personnalisé
app.post('/submit-quote', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, projectDetails } = req.body;

        // Envoyer une notification Discord
        await hook.send(`Nouvelle demande de devis !\n
            **Client:** ${firstName} ${lastName}
            **Email:** ${email}
            **Téléphone:** ${phone}
            **Projet:**
            ${projectDetails}`);

        // Envoyer un email de confirmation
        await transporter.sendMail({
            from: notificationConfig.email.auth.user,
            to: email,
            subject: 'Confirmation de votre demande de devis - Voix Off Pro',
            html: `
                <h2>Merci pour votre demande de devis !</h2>
                <p>Cher(e) ${firstName},</p>
                <p>Nous avons bien reçu votre demande de devis et nous vous remercions de votre intérêt pour nos services.</p>
                <p>Nous étudions votre projet avec attention et nous vous contacterons dans les plus brefs délais avec une proposition personnalisée.</p>
                <p>Récapitulatif de votre demande :</p>
                <ul>
                    <li><strong>Projet :</strong> ${projectDetails}</li>
                </ul>
                <p>Si vous avez des questions entre-temps, n'hésitez pas à nous contacter.</p>
                <p>Cordialement,<br>L'équipe Voix Off Pro</p>
            `
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: error.message });
    }
});

// Démarrer le serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`
=================================
🚀 Serveur démarré sur le port ${port}
📱 Accédez au site sur http://localhost:${port}
=================================
`);
}); 