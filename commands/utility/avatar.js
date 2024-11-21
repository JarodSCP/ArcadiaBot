// commands/utility/avatar.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'avatar',
    description: 'Affiche l\'avatar d\'un utilisateur.',
    category: 'Utilitaires',
    usage: '!avatar @user',
    execute(message, args) {
        const user = message.mentions.users.first() || message.author;
        const avatarEmbed = new EmbedBuilder()
            .setTitle(`${user.tag}'s Avatar`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor('#6e6af6');
        message.channel.send({ embeds: [avatarEmbed] });
    },
};
