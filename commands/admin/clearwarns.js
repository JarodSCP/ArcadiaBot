// commands/moderation/clearwarns.js
module.exports = {
    name: 'clearwarns',
    description: 'Efface tous les avertissements d\'un utilisateur.',
    category: 'Administrations',
    async execute(message, args) {
        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.reply('Vous n\'avez pas la permission de supprimer les avertissements.');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Veuillez mentionner un utilisateur pour effacer ses avertissements.');
        }

        message.client.warns.delete(user.id);
        message.channel.send(`🧼 Les avertissements de ${user.tag} ont été effacés.`);
    }
};
