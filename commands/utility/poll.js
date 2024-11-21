// commands/utility/poll.js
module.exports = {
    name: 'poll',
    description: 'Crée un sondage avec des réactions pour voter.',
    category: 'Utilitaires',
    async execute(message, args) {
        const pollQuestion = args.join(' ');

        if (!pollQuestion) {
            return message.reply('Veuillez fournir une question pour le sondage.');
        }

        try {
            const pollMessage = await message.channel.send(`📊 **Sondage** : ${pollQuestion}`);
            await pollMessage.react('👍');
            await pollMessage.react('👎');
            message.delete(); // Supprime la commande pour garder le sondage propre
        } catch (error) {
            console.error('Erreur lors de la création du sondage:', error);
            message.reply('Impossible de créer le sondage.');
        }
    }
};
