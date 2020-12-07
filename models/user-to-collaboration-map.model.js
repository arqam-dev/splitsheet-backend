const Db = require('../server/boot/db.connection');
const {
    DataTypes
} = require("sequelize");

// db schema

const UserToCollaborationMap = Db.define('UserToCollaborationMap', {
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
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    paranoid: true,
});

module.exports = UserToCollaborationMap;