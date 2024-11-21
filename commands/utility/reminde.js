// commands/utility/remindme.js
const ms = require('ms');

module.exports = {
    name: 'remindme',
    description: 'Rappelle quelque chose après un certain temps.',
    category: 'Utilitaires',
    usage: '!remindme [time] [message]',
    async execute(message, args) {
        const time = args[0];
        const reminder = args.slice(1).join(' ');

        if (!time || !reminder) return message.reply('Utilisation : `!remindme [time] [message]`');

        message.reply(`Je te rappellerai cela dans ${time}.`);
        setTimeout(() => {
            message.author.send(`⏰ Rappel : ${reminder}`);
        }, ms(time));
    },
};
