// commands/moderation/temprole.js
const ms = require('ms');

module.exports = {
    name: 'temprole',
    description: 'Attribut un rôle temporaire à un utilisateur.',
    category: 'Administrations',
    usage: '!temprole @user [role] [duration]',
    async execute(message, args) {
        const user = message.mentions.members.first();
        const roleName = args[1];
        const duration = args[2];
        const role = message.guild.roles.cache.find(r => r.name === roleName);

        if (!role) return message.reply('Le rôle spécifié est introuvable.');
        if (!user) return message.reply('Mentionne un utilisateur à qui attribuer le rôle.');

        await user.roles.add(role);
        message.channel.send(`${user.user.tag} a reçu le rôle ${roleName} pour ${duration}.`);

        setTimeout(() => {
            user.roles.remove(role);
            message.channel.send(`${user.user.tag} a perdu le rôle ${roleName} après ${duration}.`);
        }, ms(duration));
    },
};
