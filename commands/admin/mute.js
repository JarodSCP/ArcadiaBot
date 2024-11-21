// commands/admin/mute.js
module.exports = {
    name: 'mute',
    description: 'Rend un membre muet.',
    category: 'Administrations',
    async execute(message, args) {
        if (!message.member.permissions.has('MODERATE_MEMBERS')) {
            return message.reply('Vous n\'avez pas la permission de rendre muet des membres.');
        }
        const member = message.mentions.members.first();
        const reason = args.slice(1).join(' ') || 'Raison non spécifiée';
        if (!member) return message.reply('Veuillez mentionner un membre à rendre muet.');

        try {
            await member.timeout(60 * 60 * 1000, reason); // 1 heure de mute
            message.channel.send(`${member.user.tag} a été rendu muet pour 1 heure. Raison : ${reason}`);
        } catch (error) {
            console.error('Erreur lors du mute:', error);
            message.reply('Impossible de rendre ce membre muet.');
        }
    }
};
