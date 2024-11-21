// commands/raid/antispam.js
const spammers = new Map();

module.exports = {
    name: 'antispam',
    description: 'Active ou désactive la protection contre le spam.',
    category: 'Protéction',
    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('Vous n\'avez pas la permission de faire cela.');
        }

        const mode = args[0];
        if (mode === 'on') {
            message.client.antispam = true;
            message.channel.send('🚨 Protection contre le spam activée.');
        } else if (mode === 'off') {
            message.client.antispam = false;
            message.channel.send('🚨 Protection contre le spam désactivée.');
        } else {
            message.channel.send('Utilisation : !antispam <on/off>');
        }
    }
};
