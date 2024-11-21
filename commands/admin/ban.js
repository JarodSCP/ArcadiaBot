// commands/admin/ban.js
module.exports = {
    name: 'ban',
    description: 'Bannit un membre du serveur.',
    category: 'Administrations',
    async execute(message, args) {
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.reply('Vous n\'avez pas la permission de bannir des membres.');
        }
        const member = message.mentions.members.first();
        const reason = args.slice(1).join(' ') || 'Raison non spécifiée';
        if (!member) return message.reply('Veuillez mentionner un membre à bannir.');

        try {
            await member.ban({ reason });
            message.channel.send(`${member.user.tag} a été banni pour la raison : ${reason}`);
        } catch (error) {
            console.error('Erreur lors du bannissement:', error);
            message.reply('Impossible de bannir ce membre.');
        }
    }
};
