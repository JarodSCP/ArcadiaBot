// commands/raid/antiraid.js
module.exports = {
    name: 'antiraid',
    description: 'Active ou désactive la protection contre les raids.',
    category: 'Protéction',
    execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('Vous n\'avez pas la permission de faire cela.');
        }

        const mode = args[0];
        if (mode === 'on') {
            message.client.antiraid = true;
            message.channel.send('🚨 Protection contre les raids activée.');
        } else if (mode === 'off') {
            message.client.antiraid = false;
            message.channel.send('🚨 Protection contre les raids désactivée.');
        } else {
            message.channel.send('Utilisation : !antiraid <on/off>');
        }
    }
};
