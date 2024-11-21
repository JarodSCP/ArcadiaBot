// commands/utility/announce.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'announce',
    description: 'Fait une annonce dans un canal spécifié.',
    category: 'Utilitaires',
    async execute(message, args) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('Vous n\'avez pas la permission de faire des annonces.');
        }

        const channel = message.mentions.channels.first();
        const announcement = args.slice(1).join(' ');

        if (!channel) {
            return message.reply('Veuillez mentionner un canal pour l\'annonce.');
        }

        if (!announcement) {
            return message.reply('Veuillez spécifier le message de l\'annonce.');
        }

        const announceEmbed = new EmbedBuilder()
            .setTitle('📢 Annonce')
            .setDescription(announcement)
            .setColor('#6e6af6')
            .setTimestamp();

        try {
            channel.send({ embeds: [announceEmbed] });
            message.channel.send(`✅ L'annonce a été envoyée dans ${channel}.`);
        } catch (error) {
            console.error('Erreur lors de l\'annonce:', error);
            message.reply('Impossible de faire cette annonce.');
        }
    }
};
