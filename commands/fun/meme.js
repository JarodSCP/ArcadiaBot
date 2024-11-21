// commands/fun/meme.js
const axios = require('axios');

module.exports = {
    name: 'meme',
    description: 'Envoie un meme aléatoire.',
    category: 'Fun',
    async execute(message, args) {
        try {
            const response = await axios.get('https://meme-api.herokuapp.com/gimme');
            const meme = response.data;
            message.channel.send({ content: meme.url });
        } catch (err) {
            console.error(err);
            message.reply('Impossible de récupérer un meme pour le moment.');
        }
    },
};
