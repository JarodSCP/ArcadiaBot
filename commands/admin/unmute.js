// commands/admin/unmute.js
module.exports = {
    name: 'unmute',
    description: 'Annule le mute d\'un membre.',
    category: 'Administrations',
    async execute(message, args) {
        if (!message.member.permissions.has('MODERATE_MEMBERS')) {
            return message.reply('Vous n\'avez pas la permission de rendre la parole aux membres.');
        }
        const member = message.mentions.members.first();
        if (!member) return message.reply('Veuillez mentionner un membre à démute.');

        try {
            await member.timeout(null);
            message.channel.send(`${member.user.tag} n'est plus muet.`);
        } catch (error) {
            console.error('Erreur lors du unmute:', error);
            message.reply('Impossible de démute ce membre.');
        }
    }
};
