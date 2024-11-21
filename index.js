// index.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { Sequelize } = require('sequelize');
const winston = require('winston');
const config = require('./config.json');
const play = require('play-dl');
const { Manager } = require('erela.js');
const voiceStateUpdateHandler = require('./events/voiceStateUpdate');



// Initialisation de la base de données avec Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'data', 'levels.sqlite')
});

// Importation du modèle Level
const LevelModel = require('./models/Level')(sequelize);

// Configurer les identifiants Spotify à partir de config.json
play.setToken({
  spotify: {
    client_id: config.spotify.clientID,
    client_secret: config.spotify.clientSecret
  }
});

// Fonction pour vérifier et rafraîchir le token Spotify
async function refreshSpotifyToken() {
  if (play.is_expired()) {
    try {
      await play.refreshToken();
      console.log('Token Spotify rafraîchi avec succès.');
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token Spotify :', error);
    }
  }
}

// Initialisation du client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel]
});

// Attacher le modèle Level au client
client.Level = LevelModel;

// Initialisation de la collection de commandes
client.commands = new Collection();
client.queue = new Map();

// Configuration de Lavalink
client.manager = new Manager({
  nodes: [
    {
      host: "node01.marshalxp.xyz",
      port: 443,
      password: "auto.marshal.co",
      secure: true,
    },
  ],
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
});

client.manager.on("nodeConnect", node => {
  console.log(`Lavalink Node ${node.options.identifier} connecté.`);
});

client.manager.on("nodeError", (node, error) => {
  console.error(`Lavalink Node ${node.options.identifier} a rencontré une erreur: ${error.message}`);
});

// Configuration des logs avec Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}] ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/bot.log' })
  ],
});

client.logger = logger;

// Création d'une application Express
const app = express();

// Configuration pour servir des fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Route pour la page principale
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Ma Page Web</title>
      </head>
      <body>
        <h1>Bienvenue sur ma page web !</h1>
        <p>Ceci est une page simple servie par votre bot Discord.</p>
      </body>
    </html>
  `);
});

// Démarrer le serveur Express
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur web en cours d'exécution sur http://localhost:${PORT}`);
});

// Chemin vers le fichier botInfo.json
const botInfoPath = path.join(__dirname, 'data', 'botInfo.json');

// Lire l'heure du dernier démarrage
let lastStartTime = 0;
if (fs.existsSync(botInfoPath)) {
  const botInfoData = fs.readFileSync(botInfoPath);
  const botInfo = JSON.parse(botInfoData);
  lastStartTime = botInfo.lastStartTime || 0;
}

// Lecture des commandes
const commandsPath = path.join(__dirname, 'commands');
const commandCategories = fs.readdirSync(commandsPath);

for (const category of commandCategories) {
  const categoryPath = path.join(commandsPath, category);
  const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(categoryPath, file);
    const command = require(filePath);
    if ('name' in command && 'execute' in command) {
      client.commands.set(command.name, command);
      console.log(`Commande chargée: ${command.name} (${category})`);
    } else {
      console.warn(`[AVERTISSEMENT] La commande ${file} dans ${category} est mal formatée.`);
    }
  }
}

// Lecture des événements
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
  console.log(`Événement chargé: ${event.name}`);
}

client.on(voiceStateUpdateHandler.name, (...args) => voiceStateUpdateHandler.execute(...args, client));


// Synchronisation de la base de données
sequelize.sync().then(async () => {
  console.log('Base de données synchronisée.');

  // Lecture des données de configuration des rôles
  const setupDataPath = path.join(__dirname, 'data', 'setupRoleData.json');
  if (fs.existsSync(setupDataPath)) {
    const setupData = JSON.parse(fs.readFileSync(setupDataPath));
    const channel = client.channels.cache.get('ID_DE_VOTRE_CANAL'); // Remplacez par l'ID de votre canal

    for (const messageId of setupData.messageIds) {
      try {
        const message = await channel.messages.fetch(messageId);
        await message.channel.send({ embeds: message.embeds }); // Renvoie le même embed
      } catch (error) {
        console.error(`Erreur lors de la récupération du message ${messageId}:`, error);
      }
    }
  }

  // Mettre à jour l'heure de démarrage dans le fichier
  const newBotInfo = { lastStartTime: Date.now() };
  fs.writeFileSync(botInfoPath, JSON.stringify(newBotInfo, null, 2));

  client.login(process.env['DISCORD_TOKEN']);
}).catch(err => {
  console.error('Erreur de synchronisation de la base de données:', err);
});

// Gestion des erreurs globales
process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
  client.logger.error(`Unhandled promise rejection: ${error.message}`);
});

process.on('uncaughtException', error => {
  console.error('Uncaught exception:', error);
  client.logger.error(`Uncaught exception: ${error.message}`);
});

// Crée une Map pour stocker les avertissements, accessible globalement.
client.warns = new Map();

// Vérification de la validité du token Spotify lors du démarrage
refreshSpotifyToken();
