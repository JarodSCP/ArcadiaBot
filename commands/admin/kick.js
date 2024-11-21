// commands/admin/kick.js
module.exports = {
    name: 'kick',
    description: 'Expulse un membre du serveur.',
    category: 'Administrations',
    async execute(message, args) {
        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.reply('Vous n\'avez pas la permission d\'expulser des membres.');
        }
        const member = message.mentions.members.first();
        const reason = args.slice(1).join(' ') || 'Raison non spécifiée';
        if (!member) return message.reply('Veuillez mentionner un membre à expulser.');

        try {
            await member.kick(reason);
            message.channel.send(`${member.user.tag} a été expulsé pour la raison : ${reason}`);
        } catch (error) {
            console.error('Erreur lors de l\'expulsion:', error);
            message.reply('Impossible d\'expulser ce membre.');
        }
    }
};
