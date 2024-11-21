// commands/utility/serverinfo.js
module.exports = {
    name: 'serverinfo',
    description: 'Affiche des informations sur le serveur.',
    category: 'Utilitaires',
    async execute(message) {
        const { guild } = message;

        const serverInfo = `
        📅 Créé le : ${guild.createdAt.toDateString()}
        👥 Membres : ${guild.memberCount}
        🛠️ Rôles : ${guild.roles.cache.size}
        🌍 Région : ${guild.preferredLocale}
        🔐 Propriétaire : <@${guild.ownerId}>
        `;

        message.channel.send(`**Informations sur le serveur : ${guild.name}**\n${serverInfo}`);
    }
};
