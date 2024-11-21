// commands/moderation/purge.js
module.exports = {
    name: 'purge',
    description: 'Supprime les messages d\'un utilisateur spécifique.',
    category: 'Administrations',
    async execute(message, args) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('Vous n\'avez pas la permission de supprimer des messages.');
        }

        const user = message.mentions.users.first();
        const amount = parseInt(args[1]);

        if (!user) {
            return message.reply('Veuillez mentionner un utilisateur dont les messages doivent être supprimés.');
        }

        if (isNaN(amount) || amount < 1 || amount > 100) {
            return message.reply('Veuillez spécifier un nombre de messages à supprimer entre 1 et 100.');
        }

        const messages = await message.channel.messages.fetch({ limit: 100 });
        const filteredMessages = messages.filter(msg => msg.author.id === user.id).first(amount);

        try {
            await message.channel.bulkDelete(filteredMessages, true);
            message.channel.send(`🧹 ${amount} messages de ${user.tag} ont été supprimés.`);
        } catch (error) {
            console.error('Erreur lors de la suppression des messages:', error);
            message.reply('Impossible de supprimer les messages de cet utilisateur.');
        }
    }
};
