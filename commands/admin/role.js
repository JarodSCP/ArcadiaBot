// commands/admin/role.js
module.exports = {
    name: 'role',
    description: 'Ajoute ou retire un rôle à un utilisateur.',
    category: 'Administrations',
    async execute(message, args) {
        if (!message.member.permissions.has('MANAGE_ROLES')) {
            return message.reply('Vous n\'avez pas la permission de gérer les rôles.');
        }

        const member = message.mentions.members.first();
        const roleName = args.slice(1).join(' ');
        const role = message.guild.roles.cache.find(r => r.name === roleName);

        if (!member || !role) {
            return message.reply('Veuillez mentionner un utilisateur et fournir un rôle valide.');
        }

        if (member.roles.cache.has(role.id)) {
            await member.roles.remove(role);
            message.channel.send(`${role.name} a été retiré à ${member.user.tag}.`);
        } else {
            await member.roles.add(role);
            message.channel.send(`${role.name} a été ajouté à ${member.user.tag}.`);
        }
    }
};
