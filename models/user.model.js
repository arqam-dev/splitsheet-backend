const Db = require('../server/boot/db.connection');
const {
    DataTypes
} = require("sequelize");

// import models for the relations
const Collaboration = require('./collaboration.model');
const CollaborationToUserMap = require('./user-to-collaboration-map.model');

// db schema
const User = Db.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: true,
        default: null
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: true,
        default: null
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_no: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    present_address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    permanent_address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    postal_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_account_verfied: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
}, {
    freezeTableName: true,
    paranoid: true
});

// Relations
User.hasMany(Collaboration, {
    foreignKey: 'user_id'
});
User.hasMany(CollaborationToUserMap, {
    foreignKey: 'user_id'
});

module.exports = User;