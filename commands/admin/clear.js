// commands/moderation/clear.js
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'clear',
    description: 'Supprime un nombre spécifié de messages.',
    category: 'Administrations',
    usage: '!clear [nombre]',
    permissions: [PermissionsBitField.Flags.ManageMessages],
    async execute(message, args) {
        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount <= 0 || amount > 100) {
            return message.reply('Merci de fournir un nombre entre 1 et 100.');
        }
        try {
            const deleted = await message.channel.bulkDelete(amount, true);
            const embed = new EmbedBuilder()
                .setTitle('Messages supprimés')
                .addFields({ name: 'Nombre de messages supprimés', value: `${deleted.size}` })
                .setColor('#00ff00')
                .setTimestamp();
            const msg = await message.channel.send({ embeds: [embed] });
            setTimeout(() => msg.delete(), 5000);

            // Log dans le channel de logs
            const logChannel = message.guild.channels.cache.get(config.logChannelID);
            if (logChannel) {
                logChannel.send({ embeds: [embed] });
            }
        } catch (err) {
            console.error(err);
            message.reply('Je ne peux pas supprimer les messages.');
        }
    },
};
