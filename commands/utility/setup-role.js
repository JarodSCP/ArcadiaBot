// commands/utility/setup-role.js
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'setup-role',
    description: 'Configure les rôles avec des réactions.',
    category: 'Utilitaires',
    async execute(message, args) {
        const colorRoles = ['ROUGE', 'VERT', 'JAUNE', 'BLANC', 'NOIR', 'ROSE', 'BLEU'];
        const gameRoles = ['VRCHAT', 'MINECRAFT', 'PALADIN', 'OVERWATCH', 'FORTNITE', 'GARRY\'S MOD', 'ROBLOX'];
        const platformRoles = ['ANDROID', 'IPHONE', 'PC', 'PLAYSTATION 5', 'PLAYSTATION 4', 'XBOX X', 'XBOX S'];
        const ageRoles = ['+18', '-18'];

        // Envoie des messages et récupère leurs IDs
        const messageIds = [];

        // 1. Couleurs
        const colorEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Quelle couleur voulez-vous avoir ?')
            .setDescription(colorRoles.map(role => `\`${role}\``).join(', '));

        const colorMessage = await message.channel.send({ embeds: [colorEmbed] });
        for (const role of colorRoles) {
            await colorMessage.react(role); // Réagissez avec le nom du rôle
        }
        messageIds.push(colorMessage.id);

        // 2. Jeux
        const gameEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('À quel jeu jouez-vous ?')
            .setDescription(gameRoles.map(role => `\`${role}\``).join(', '));

        const gameMessage = await message.channel.send({ embeds: [gameEmbed] });
        for (const role of gameRoles) {
            await gameMessage.react(role);
        }
        messageIds.push(gameMessage.id);

        // 3. Plateformes
        const platformEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Sur quelle plateforme êtes-vous ?')
            .setDescription(platformRoles.map(role => `\`${role}\``).join(', '));

        const platformMessage = await message.channel.send({ embeds: [platformEmbed] });
        for (const role of platformRoles) {
            await platformMessage.react(role);
        }
        messageIds.push(platformMessage.id);

        // 4. Âge
        const ageEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Avez-vous +18 ou -18 ?')
            .setDescription(ageRoles.map(role => `\`${role}\``).join(', '));

        const ageMessage = await message.channel.send({ embeds: [ageEmbed] });
        for (const role of ageRoles) {
            await ageMessage.react(role);
        }
        messageIds.push(ageMessage.id);

        // Sauvegarde des messages dans un fichier
        const fs = require('fs');
        const path = require('path');
        const setupDataPath = path.join(__dirname, '../../data/setupRoleData.json');

        fs.writeFileSync(setupDataPath, JSON.stringify({ messageIds }, null, 2));
        message.channel.send('Configuration des rôles terminée !');
    }
};
