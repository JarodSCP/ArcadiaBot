// commands/admin/forceban.js
module.exports = {
    name: 'forceban',
    description: 'Bannit un utilisateur par son ID.',
    category: 'Administrations',
    async execute(message, args) {
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.reply('Vous n\'avez pas la permission de bannir des membres.');
        }
        const userId = args[0];
        const reason = args.slice(1).join(' ') || 'Raison non spécifiée';
        if (!userId) return message.reply('Veuillez fournir l\'ID d\'un utilisateur à bannir.');

        try {
            await message.guild.members.ban(userId, { reason });
            message.channel.send(`🔨 L'utilisateur avec l'ID ${userId} a été banni. Raison : ${reason}`);
        } catch (error) {
            console.error('Erreur lors du bannissement par ID:', error);
            message.reply('Impossible de bannir cet utilisateur.');
        }
    }
};
