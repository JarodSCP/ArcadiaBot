// events/ready.js
const { Events, EmbedBuilder } = require('discord.js');
const config = require('../config.json');
const updateStats = require('../utils/updateStats');
const fs = require('fs');
const path = require('path');

// Chemin vers le fichier botInfo.json
const botInfoPath = path.join(__dirname, '..', 'data', 'botInfo.json');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Connecté en tant que ${client.user.tag}`);

    // Lire l'heure du dernier démarrage
    let lastStartTime = 0;
    if (fs.existsSync(botInfoPath)) {
      const botInfoData = fs.readFileSync(botInfoPath);
      const botInfo = JSON.parse(botInfoData);
      lastStartTime = botInfo.lastStartTime || 0;
    }

    // Pour chaque serveur où le bot est présent
    client.guilds.cache.forEach(async guild => {
      // Mettre à jour les statistiques
      await updateStats(client, guild);

      // Charger tous les membres du serveur
      await guild.members.fetch();

      // Récupérer les membres qui ont rejoint depuis le dernier démarrage
      const newMembers = guild.members.cache.filter(member => member.joinedTimestamp > lastStartTime);

      // Canal de bienvenue
      const channel = guild.channels.cache.get(config.welcomeChannelID);

      newMembers.forEach(member => {
        // Envoyer le message de bienvenue
        if (channel) {
          const welcomeEmbed = new EmbedBuilder()
            .setTitle('🎉 Bienvenue !')
            .setDescription(`Bienvenue sur le serveur, ${member.user}! Nous sommes ravis de t'accueillir ici. 🥳\n\nN'hésite pas à lire les règles et à te présenter !`)
            .setColor('#6e6af6')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

          channel.send({ embeds: [welcomeEmbed] });
        }
      });
    });

    // Mettre à jour l'heure de démarrage dans le fichier
    const newBotInfo = { lastStartTime: Date.now() };
    fs.writeFileSync(botInfoPath, JSON.stringify(newBotInfo, null, 2));
  },
};
