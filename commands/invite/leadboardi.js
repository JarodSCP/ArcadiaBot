// commands/utility/leadboardi.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'leadboardi',
    description: 'Affiche le leaderboard des invitations.',
    category: 'Invitation',
    async execute(message, args, client) {
        const guild = message.guild;

        // Vérifie si l'utilisateur a la permission d'afficher le leaderboard
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.reply('Vous n\'avez pas la permission de voir le leaderboard des invitations.');
        }

        // Récupère les invitations pour le serveur
        try {
            const invites = await guild.invites.fetch();

            // Transforme les invites en un tableau et trie par le nombre d'utilisateurs invités
            const inviteLeaderboard = invites.map(invite => {
                return {
                    code: invite.code,
                    uses: invite.uses,
                    inviter: invite.inviter ? invite.inviter.username : 'Inconnu'
                };
            }).sort((a, b) => b.uses - a.uses);

            // Crée l'embed pour afficher le leaderboard
            const leaderboardEmbed = new EmbedBuilder()
                .setTitle('🏆 Leaderboard des Invitations')
                .setColor('#6e6af6')
                .setTimestamp();

            // Ajoute les utilisateurs invités à l'embed
            inviteLeaderboard.forEach((invite, index) => {
                leaderboardEmbed.addFields({
                    name: `#${index + 1} - ${invite.inviter}`,
                    value: `Code: ${invite.code} - Utilisations: ${invite.uses}`,
                    inline: false
                });
            });

            // Envoie l'embed dans le canal
            message.channel.send({ embeds: [leaderboardEmbed] });

        } catch (error) {
            console.error('Erreur lors de la récupération des invitations:', error);
            message.reply('Impossible de récupérer le leaderboard des invitations.');
        }
    }
};
