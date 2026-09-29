// Configuration des API
const config = {
    // PayPal configuration
    paypal: {
        clientId: 'AfSDWi9ZAqSEP1EP3hKsD92ibjMYQG7n5V6C61ydnM2mtL8eZKu_A8FqYru66vQdbdxjjZzdfhelqYge',
        merchantId: 'VincentHeen',
        currency: 'EUR',
        locale: 'fr_FR',
        merchantCountry: 'FR'
    },
    
    // Configuration Email (utilisation de EmailJS)
    emailjs: {
        serviceId: 'YOUR_EMAILJS_SERVICE_ID',
        userId: 'YOUR_EMAILJS_USER_ID',
        orderConfirmationTemplateId: 'YOUR_EMAILJS_TEMPLATE_ID'
    },
    
    // Discord Webhook
    discord: {
        webhookUrl: process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/votre_webhook_url'
    },

    stripe: {
        publicKey: 'pk_test_51OvLxbLVPYNZNXXXXXXXXXXX'
    },

    bankInfo: {
        bankName: "Société Générale",
        iban: "FR76 3000 3021 9700 0500 4296 904",
        bic: "SOGEFRPP",
        accountName: "VOIX OFF PRO"
    }
};

// Configuration publique (accessible côté client)
const publicConfig = {
    paypal: {
        clientId: config.paypal.clientId
    },
    emailjs: {
        serviceId: config.emailjs.serviceId,
        templateId: config.emailjs.templateId,
        orderConfirmationTemplateId: config.emailjs.orderConfirmationTemplateId,
        userId: config.emailjs.userId
    }
};

// Configuration du serveur
const serverConfig = {
    port: process.env.PORT || 3000,
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
};

// Configuration des notifications
const notificationConfig = {
    discord: {
        webhookUrl: config.discord.webhookUrl
    },
    email: {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'votre-email@gmail.com',
            pass: process.env.EMAIL_PASSWORD || 'votre-mot-de-passe-app'
        }
    }
};

// Exporter les configurations
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { config, publicConfig, serverConfig, notificationConfig };
} else {
    window.config = publicConfig;
    window.serverConfig = { ...serverConfig, baseUrl: window.location.origin };
} 