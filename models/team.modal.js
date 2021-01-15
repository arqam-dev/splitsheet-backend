const Db = require('../server/boot/db.connection');
const {
    DataTypes
} = require("sequelize");


// import models
const UserToTeamMap = require('./user-to-team-map');

// db schema
const Team = Db.define('Team', {
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
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    freezeTableName: true
});

// Relations
// Team.hasMany(Collaboration, {
//     foreignKey: 'team_id',
// });

Team.hasMany(UserToTeamMap, {
    foreignKey: 'team_id',
});

// User id Whose create the project

module.exports = Team;