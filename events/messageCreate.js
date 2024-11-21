// events/messageCreate.js
const { Events } = require('discord.js');
const config = require('../config.json');
const updateStats = require('../utils/updateStats');

const xpCooldowns = new Map();

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    const prefix = config.prefix || '!';
    const userId = message.author.id;
    const guildId = message.guild.id;

    // Gestion des commandes
    if (message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();

      const command = client.commands.get(commandName);
      if (!command) return;

      try {
        await command.execute(message, args, client);
      } catch (error) {
        console.error('Erreur lors de l\'exécution de la commande :', error);
        message.reply('Il y a eu une erreur en exécutant cette commande.');
      }
    }

    // Gestion des XP (avec gestion du cooldown)
    const now = Date.now();
    const cooldownAmount = (config.xpSettings.cooldown || 60) * 1000;

    if (xpCooldowns.has(userId)) {
      const expirationTime = xpCooldowns.get(userId) + cooldownAmount;
      if (now < expirationTime) {
        return;
      }
    }

    xpCooldowns.set(userId, now);

    // Calcul des gains d'XP
    const xpMin = config.xpSettings.minXp || 5;
    const xpMax = config.xpSettings.maxXp || 15;
    let xpToAdd = Math.floor(Math.random() * (xpMax - xpMin + 1)) + xpMin;

    // Double XP les week-ends
    const isWeekend = config.doubleXpWeekends && [0, 6].includes(new Date().getDay());
    if (isWeekend) {
      xpToAdd *= 2;
    }

    // Gestion des niveaux
    const Level = client.Level;

    if (!Level) {
      console.error('Le modèle Level est introuvable sur le client.');
      return;
    }

    let userLevel = await Level.findOne({ where: { userId, guildId } });

    if (!userLevel) {
      userLevel = await Level.create({ userId, guildId, xp: xpToAdd, level: 1 });
    } else {
      userLevel.xp += xpToAdd;

      // Calcul de l'XP nécessaire pour atteindre le niveau suivant
      const xpNeeded = userLevel.level * 100 + 100;
      if (userLevel.xp >= xpNeeded) {
        userLevel.level += 1;
        userLevel.xp -= xpNeeded;
        message.channel.send(`${message.author}, félicitations ! Tu es passé au niveau ${userLevel.level}. 🎉`);

        // Attribution des rôles de niveau
        const roleName = config.levelRoles[userLevel.level];
        if (roleName) {
          const role = message.guild.roles.cache.find(r => r.name === roleName);
          if (role) {
            try {
              await message.member.roles.add(role);
              message.channel.send(`${message.author}, tu as reçu le rôle **${role.name}** pour avoir atteint le niveau ${userLevel.level}.`);
            } catch (error) {
              console.error('Erreur lors de l\'attribution du rôle :', error);
              message.channel.send('Erreur lors de l\'attribution du rôle. Vérifie que j\'ai les permissions nécessaires.');
            }

            // Suppression des anciens rôles de niveau
            Object.keys(config.levelRoles).forEach(async (lvl) => {
              if (parseInt(lvl) < userLevel.level) {
                const oldRoleName = config.levelRoles[lvl];
                const oldRole = message.guild.roles.cache.find(r => r.name === oldRoleName);
                if (oldRole && message.member.roles.cache.has(oldRole.id)) {
                  try {
                    await message.member.roles.remove(oldRole);
                  } catch (error) {
                    console.error('Erreur lors de la suppression de l\'ancien rôle :', error);
                  }
                }
              }
            });
          } else {
            console.warn(`Le rôle pour le niveau ${userLevel.level} est introuvable.`);
          }
        }
      }
      await userLevel.save();
    }

    // Mise à jour des statistiques (si nécessaire)
    if (updateStats && message.guild && client) {
      try {
        await updateStats(client, message.guild);
      } catch (error) {
        console.error('Erreur lors de la mise à jour des statistiques :', error);
      }
    }
  },
};
