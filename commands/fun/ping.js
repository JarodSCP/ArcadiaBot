// commands/fun/ping.js
module.exports = {
    name: 'ping',
    description: 'Répond avec Pong!',
    category: 'Fun',
    execute(message, args) {
        message.reply('Pong! 🏓');
    },
};
