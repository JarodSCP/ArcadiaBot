// models/Level.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Level = sequelize.define('Level', {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        guildId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        xp: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        level: {
            type: DataTypes.INTEGER,
            defaultValue: 1, // Commence à 1 si nécessaire
        },
        bio: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
    });

    Level.prototype.getXPToLevel = function () {
        return this.level * 100 + 100;
    };

    return Level;
};
