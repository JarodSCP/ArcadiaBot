// events/guildMemberRemove.js
const { Events, EmbedBuilder } = require('discord.js');
const config = require('../config.json');
const updateStats = require('../utils/updateStats');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        const channel = member.guild.channels.cache.get(config.goodbyeChannelID);
        if (channel) {
            const goodbyeEmbed = new EmbedBuilder()
                .setTitle('👋 Au revoir')
                .setDescription(`${member.user.tag} nous a quittés. Nous espérons te revoir bientôt !`)
                .setColor('#ff4f4f')
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            channel.send({ embeds: [goodbyeEmbed] });
        }

        // Mettre à jour les statistiques du serveur
        await updateStats(member.guild);
    },
};
