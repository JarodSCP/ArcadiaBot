// commands/moderation/warn.js
module.exports = {
    name: 'warn',
    description: 'Donne un avertissement à un membre.',
    category: 'Administrations',
    async execute(message, args) {
        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.reply('Vous n\'avez pas la permission de donner des avertissements.');
        }

        const user = message.mentions.users.first();
        const reason = args.slice(1).join(' ') || 'Raison non spécifiée';

        if (!user) {
            return message.reply('Veuillez mentionner un utilisateur à avertir.');
        }

        const userWarnings = message.client.warns.get(user.id) || [];
        userWarnings.push({ reason, date: new Date() });
        message.client.warns.set(user.id, userWarnings);

        message.channel.send(`${user.tag} a été averti pour la raison : ${reason}`);
    }
};
