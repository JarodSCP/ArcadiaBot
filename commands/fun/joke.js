// commands/fun/joke.js
const axios = require('axios');

module.exports = {
    name: 'joke',
    description: 'Envoie une blague aléatoire.',
    category: 'Fun',
    async execute(message, args) {
        try {
            const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
            const joke = response.data;
            message.channel.send(`${joke.setup}\n||${joke.punchline}||`); // Punchline cachée
        } catch (err) {
            console.error(err);
            message.reply('Impossible de récupérer une blague pour le moment.');
        }
    },
};
