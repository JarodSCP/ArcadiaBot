// commands/raid/whitelist.js
const whitelist = new Set();

module.exports = {
    name: 'whitelist',
    description: 'Ajoute ou retire un utilisateur de la liste blanche des protections.',
    category: 'Protéction',
    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('Vous n\'avez pas la permission de faire cela.');
        }

        const user = message.mentions.users.first();
        if (!user) return message.reply('Veuillez mentionner un utilisateur.');

        if (args[0] === 'add') {
            whitelist.add(user.id);
            message.channel.send(`${user.tag} a été ajouté à la liste blanche.`);
        } else if (args[0] === 'remove') {
            whitelist.delete(user.id);
            message.channel.send(`${user.tag} a été retiré de la liste blanche.`);
        } else {
            message.channel.send('Utilisation : !whitelist <add/remove> @user');
        }
    }
};
