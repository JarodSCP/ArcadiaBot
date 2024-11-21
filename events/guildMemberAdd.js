// events/guildMemberAdd.js
const { Events, EmbedBuilder } = require('discord.js');
const config = require('../config.json');
const updateStats = require('../utils/updateStats');

// Map pour suivre les nouvelles arrivées
const joins = new Map();

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const channel = member.guild.channels.cache.get(config.welcomeChannelID);

        // Message de bienvenue
        if (channel) {
            const welcomeEmbed = new EmbedBuilder()
                .setTitle('🎉 Bienvenue !')
                .setDescription(`Bienvenue sur le serveur, ${member.user}! Nous sommes ravis de t'accueillir ici. 🥳\n\nN'hésite pas à lire les règles et à te présenter !`)
                .setColor('#6e6af6')
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            channel.send({ embeds: [welcomeEmbed] });
        }

        // Protection contre les raids
        const guildId = member.guild.id;
        const currentTime = Date.now();

        if (!joins.has(guildId)) {
            joins.set(guildId, []);
        }

        const joinTimes = joins.get(guildId);
        joinTimes.push(currentTime);

        // Filtre les temps de join des 10 dernières secondes
        const recentJoins = joinTimes.filter(time => currentTime - time < 10000);
        joins.set(guildId, recentJoins);

        if (recentJoins.length > 5) { // Plus de 5 membres en 10 secondes
            try {
                await member.kick('Protection contre un raid');
                const raidWarningEmbed = new EmbedBuilder()
                    .setTitle('🚨 Raid détecté !')
                    .setDescription(`Un raid potentiel a été détecté. ${member.user.tag} a été automatiquement expulsé pour protection.`)
                    .setColor('#ff0000')
                    .setTimestamp();

                channel.send({ embeds: [raidWarningEmbed] });
            } catch (error) {
                console.error('Erreur lors de l\'expulsion du membre pour protection contre un raid:', error);
                if (channel) {
                    channel.send('❌ Erreur lors de l\'expulsion d\'un membre pour protection contre un raid.');
                }
            }
        }

        // Mettre à jour les statistiques du serveur
        await updateStats(member.guild);
    },
};
