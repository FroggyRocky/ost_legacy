const Sequelize = require('sequelize');
require('dotenv').config();

module.exports = new Sequelize('accs', 'root', '4991449702',{
    host: 'localhost',
    dialect: 'mysql'
});