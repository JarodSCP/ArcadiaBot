// commands/utility/slowmode.js
module.exports = {
    name: 'slowmode',
    description: 'Active le mode lent dans le canal.',
    category: 'Utilitaires',
    async execute(message, args) {
        if (!message.member.permissions.has('MANAGE_CHANNELS')) {
            return message.reply('Vous n\'avez pas la permission de gérer les canaux.');
        }

        const duration = parseInt(args[0]);
        if (isNaN(duration) || duration < 0 || duration > 21600) {
            return message.reply('Veuillez spécifier une durée valide en secondes (0-21600).');
        }

        try {
            await message.channel.setRateLimitPerUser(duration);
            message.channel.send(`⏳ Le mode lent est maintenant réglé à ${duration} secondes.`);
        } catch (error) {
            console.error('Erreur lors de la modification du mode lent:', error);
            message.reply('Impossible de définir le mode lent.');
        }
    }
};
