const Db = require('../server/boot/db.connection');
const {
    DataTypes
} = require("sequelize");

// import models
const CollaborationToUserMap = require('./user-to-collaboration-map.model');

// db schema
const Collaboration = Db.define('Collaboration', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    started_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    ended_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    progress: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
}, {
    freezeTableName: true
});

// Relations
Collaboration.hasMany(CollaborationToUserMap, {
    foreignKey: 'collaboration_id'
});

module.exports = Collaboration;