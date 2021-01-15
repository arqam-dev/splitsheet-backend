const Db = require('../server/boot/db.connection');
const {
    DataTypes
} = require("sequelize");

const Team = require('./team.modal');

// import models

// db schema
const Project = Db.define('Project', {
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
    total_invites: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    total_accepted_invites: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    total_rejected_invites: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
}, {
    freezeTableName: true
});

// Relations
Project.hasMany(Team, {
    foreignKey: 'project_id'
});

module.exports = Project;