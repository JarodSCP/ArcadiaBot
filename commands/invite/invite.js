// commands/utility/invite.js
module.exports = {
    name: 'invite',
    description: 'Crée une invitation pour le serveur.',
    category: 'Invitation',
    async execute(message, args) {
        if (!message.member.permissions.has('CREATE_INSTANT_INVITE')) {
            return message.reply('Vous n\'avez pas la permission de créer des invitations.');
        }

        const channel = message.channel;
        const duration = args[0] || 86400; // Durée en secondes (24 heures par défaut)
        const maxUses = args[1] || 0; // 0 signifie illimité

        try {
            const invite = await channel.createInvite({
                maxAge: duration,
                maxUses: maxUses,
                unique: true
            });

            message.channel.send(`📨 Invitation créée : ${invite.url}`);
        } catch (error) {
            console.error('Erreur lors de la création de l\'invitation:', error);
            message.reply('Impossible de créer une invitation.');
        }
    }
};
