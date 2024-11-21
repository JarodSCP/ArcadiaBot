const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'data/levels.sqlite'
});

const queryInterface = sequelize.getQueryInterface();
const migration = require('./migrations/add-bio-column');

migration.up(queryInterface, Sequelize).then(() => {
    console.log('Migration effectuée : Colonne bio ajoutée.');
    process.exit();
}).catch(error => {
    console.error('Erreur lors de la migration:', error);
    process.exit(1);
});
