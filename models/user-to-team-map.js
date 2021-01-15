const Db = require('../server/boot/db.connection');
const {
    DataTypes
} = require("sequelize");

// db schema

const UserToTeamMap = Db.define('UserToTeamMap', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
        // accepted = 1, rejected = -1, pending = 0, 
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    percentage: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    paranoid: true,
});

module.exports = UserToTeamMap;