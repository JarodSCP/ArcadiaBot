// commands/utility/userinfo.js
module.exports = {
    name: 'userinfo',
    description: 'Affiche des informations sur un utilisateur.',
    category: 'Utilitaires',
    async execute(message) {
        const user = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(user.id);

        const userInfo = `
        🆔 ID : ${user.id}
        📅 Compte créé le : ${user.createdAt.toDateString()}
        ⏳ Rejoint le : ${member.joinedAt.toDateString()}
        🎮 Rôles : ${member.roles.cache.map(role => role.name).join(', ')}
        `;

        message.channel.send(`**Informations sur ${user.tag}**\n${userInfo}`);
    }
};
