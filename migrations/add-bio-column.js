const { Sequelize } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Levels', 'bio', {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: ''
        });
    },

    down: async (queryInterface) => {
        await queryInterface.removeColumn('Levels', 'bio');
    }
};
