// commands/moderation/warnings.js
module.exports = {
    name: 'warnings',
    description: 'Affiche les avertissements d\'un utilisateur.',
    category: 'Administrations',
    async execute(message, args) {
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Veuillez mentionner un utilisateur pour voir ses avertissements.');
        }

        const userWarnings = message.client.warns.get(user.id) || [];
        if (userWarnings.length === 0) {
            return message.channel.send(`${user.tag} n'a pas d'avertissements.`);
        }

        const warningsList = userWarnings
            .map((warning, index) => `${index + 1}. ${warning.reason} - ${warning.date.toLocaleDateString()}`)
            .join('\n');

        message.channel.send(`📋 Avertissements de ${user.tag}:\n${warningsList}`);
    }
};
