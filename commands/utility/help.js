const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Affiche la liste de toutes les commandes disponibles et les détails des systèmes du bot.',
    category: 'Utilitaires',
    usage: '!help [commande]',
    async execute(message, args) {
        const { commands } = message.client;
        const embed = new EmbedBuilder()
            .setTitle('📖 **Liste des Commandes et Fonctionnalités**')
            .setColor('#6e6af6')
            .setFooter({ text: 'Utilisez !help [commande] pour obtenir des détails sur une commande spécifique.' })
            .setTimestamp();

        // Si un nom de commande spécifique est fourni, affiche les détails de cette commande
        if (args[0]) {
            const commandName = args[0].toLowerCase();
            const command = commands.get(commandName);

            if (!command) {
                return message.reply('❌ Commande non trouvée. Utilisez `!help` pour voir la liste des commandes.');
            }

            embed.setTitle(`🛠️ **Détails de la commande : ${command.name}**`)
                .setDescription(`> **Description :** ${command.description}`)
                .addFields(
                    { name: '🔧 Usage', value: command.usage || 'Aucun usage spécifique', inline: true },
                    { name: '📂 Catégorie', value: command.category || 'Aucune catégorie', inline: true }
                );

            return message.channel.send({ embeds: [embed] });
        }

        // Organiser les commandes par catégorie
        const categorizedCommands = {};

        commands.forEach(command => {
            const category = command.category || 'Autres';
            if (!categorizedCommands[category]) {
                categorizedCommands[category] = [];
            }
            categorizedCommands[category].push(`\`${command.name}\`: ${command.description}`);
        });

        // Ajouter les commandes à l'embed
        for (const [category, cmds] of Object.entries(categorizedCommands)) {
            embed.addFields({
                name: `📂 **${category.charAt(0).toUpperCase() + category.slice(1)}**`,
                value: cmds.join('\n'),
                inline: false
            });
        }

        message.channel.send({ embeds: [embed] });
    },
};
