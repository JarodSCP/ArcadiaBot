// commands/levels/rank.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'rank',
  description: 'Affiche votre rang parmi les membres.',
  category: 'Level',
  async execute(message, args) {
    const Level = message.client.Level;

    if (!Level) {
      console.error('Le modèle Level est introuvable sur le client.');
      return message.reply('Le système de niveaux est actuellement indisponible.');
    }

    const allLevels = await Level.findAll({
      where: { guildId: message.guild.id },
      order: [['level', 'DESC'], ['xp', 'DESC']],
    });

    const userLevel = allLevels.find((user) => user.userId === message.author.id);

    if (!userLevel) {
      return message.reply("Vous n'avez pas encore de niveau. Commencez à être actif pour gagner de l'XP !");
    }

    const rank = allLevels.indexOf(userLevel) + 1;

    const embed = new EmbedBuilder()
      .setTitle(`🏅 Rang de ${message.author.username}`)
      .setDescription(
        `Tu es classé **#${rank}** avec **${userLevel.level}** niveaux et **${userLevel.xp}/${userLevel.getXPToLevel()}** XP.`
      )
      .setColor('#6e6af6')
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
