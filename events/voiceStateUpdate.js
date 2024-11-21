const { Events } = require('discord.js');
const config = require('../config.json');
const updateStats = require('../utils/updateStats');

const xpCooldowns = new Map();
const voiceTime = new Map(); // Pour suivre le temps passé dans les canaux vocaux
const xpIntervals = new Map(); // Pour stocker les intervalles d'XP

const XP_PER_MINUTE = 5; // XP gagné par minute

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState, client) {
    const userId = newState.id;
    const guildId = newState.guild.id;

    // Ignore les actions des bots et les événements sans changement d'état
    if (newState.member.user.bot || !newState.guild) return;

    // Si l'utilisateur rejoint un canal vocal
    if (newState.channelId && (!oldState.channelId || oldState.channelId !== newState.channelId)) {
      // Démarre le suivi du temps passé
      voiceTime.set(userId, Date.now());

      // Crée un intervalle pour donner de l'XP
      const interval = setInterval(async () => {
        if (!newState.channelId) {
          clearInterval(interval);
          return;
        }

        const timeSpent = Math.floor((Date.now() - voiceTime.get(userId)) / 60000); // Temps en minutes
        if (timeSpent > 0) {
          await addXP(userId, guildId, timeSpent * XP_PER_MINUTE, client, newState);
        }
      }, 60000); // Vérifie toutes les minutes

      xpIntervals.set(userId, interval);
    }

    // Si l'utilisateur quitte le canal vocal
    if (!newState.channelId && oldState.channelId) {
      clearInterval(xpIntervals.get(userId)); // Arrête l'intervalle
      voiceTime.delete(userId); // Supprime le temps passé
      xpIntervals.delete(userId); // Supprime l'intervalle
    }
  },
};

// Fonction pour ajouter de l'XP
async function addXP(userId, guildId, xpToAdd, client, newState) {
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

      // Récupérer le canal pour envoyer des messages
      const channel = newState.guild.channels.cache.get(config.logChannelID);
      if (channel) {
        await channel.send(`${newState.member}, félicitations ! Tu es passé au niveau ${userLevel.level}. 🎉`);

        // Attribution des rôles de niveau
        const roleName = config.levelRoles[userLevel.level];
        if (roleName) {
          const role = newState.guild.roles.cache.find(r => r.name === roleName);
          if (role) {
            try {
              await newState.member.roles.add(role);
              await channel.send(`${newState.member}, tu as reçu le rôle **${role.name}** pour avoir atteint le niveau ${userLevel.level}.`);
            } catch (error) {
              console.error('Erreur lors de l\'attribution du rôle :', error);
              await channel.send('Erreur lors de l\'attribution du rôle. Vérifie que j\'ai les permissions nécessaires.');
            }

            // Suppression des anciens rôles de niveau
            Object.keys(config.levelRoles).forEach(async (lvl) => {
              if (parseInt(lvl) < userLevel.level) {
                const oldRoleName = config.levelRoles[lvl];
                const oldRole = newState.guild.roles.cache.find(r => r.name === oldRoleName);
                if (oldRole && newState.member.roles.cache.has(oldRole.id)) {
                  try {
                    await newState.member.roles.remove(oldRole);
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
    }
    await userLevel.save();
  }

  // Mise à jour des statistiques (si nécessaire)
  if (updateStats && newState.guild && client) {
    try {
      await updateStats(client, newState.guild);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des statistiques :', error);
    }
  }
}
