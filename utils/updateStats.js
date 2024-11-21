const config = require('../config.json');

module.exports = async (client, guild) => {
    if (!client) {
        console.error('Erreur dans updateStats : client non défini.');
        return;
    }

    if (!guild) {
        console.error('Erreur dans updateStats : guild non définie. Peut-être que le message ne provient pas d\'un serveur.');
        return;
    }

    try {
        const totalMembersChannel = client.channels.cache.get(config.statsChannels.totalMembers);
        const totalHumansChannel = client.channels.cache.get(config.statsChannels.totalHumans);
        const totalBotsChannel = client.channels.cache.get(config.statsChannels.totalBots);
        const totalChannelsChannel = client.channels.cache.get(config.statsChannels.totalChannels);
        const totalRolesChannel = client.channels.cache.get(config.statsChannels.totalRoles);

        if (totalMembersChannel) {
            await totalMembersChannel.setName(`👥・Membres: ${guild.memberCount}`);
        }

        if (totalHumansChannel) {
            const humanCount = guild.members.cache.filter(member => !member.user.bot).size;
            await totalHumansChannel.setName(`🧑・Humains: ${humanCount}`);
        }

        if (totalBotsChannel) {
            const botCount = guild.members.cache.filter(member => member.user.bot).size;
            await totalBotsChannel.setName(`🤖・Bots: ${botCount}`);
        }

        if (totalChannelsChannel) {
            await totalChannelsChannel.setName(`📚・Salons: ${guild.channels.cache.size}`);
        }

        if (totalRolesChannel) {
            await totalRolesChannel.setName(`🔖・Rôles: ${guild.roles.cache.size}`);
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour des statistiques:', error);
    }
};
