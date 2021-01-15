const Credentials = require('../config/db.credentials.json');
const Sequelize = require('sequelize');

const credentials = Credentials.production;
const Db = new Sequelize(credentials.database, credentials.user, credentials.password, {
  host: credentials.host,
  dialect: 'postgres'
});

module.exports = Db;