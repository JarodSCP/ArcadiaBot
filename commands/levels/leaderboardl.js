const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'leadboardl',
    description: 'Affiche le classement des niveaux.',
    category: 'Level',
    async execute(message, args) {
        const Level = message.client.Level;
        const topLevels = await Level.findAll({
            where: { guildId: message.guild.id },
            order: [['level', 'DESC'], ['xp', 'DESC']],
            limit: 10
        });

        if (topLevels.length === 0) {
            return message.reply('Aucun niveau trouvé.');
        }

        const embed = new EmbedBuilder()
            .setTitle('🏆 Leaderboard des Niveaux')
            .setColor('#6e6af6')
            .setTimestamp();

        topLevels.forEach((user, index) => {
            const member = message.guild.members.cache.get(user.userId);
            const username = member ? member.user.tag : 'Utilisateur inconnu';

            embed.addFields({
                name: `${index + 1}. ${username}`,
                value: `Niveau: ${user.level} | XP: ${user.xp}/${user.getXPToLevel()}`,
                inline: false
            });
        });

        message.channel.send({ embeds: [embed] });
    },
};
