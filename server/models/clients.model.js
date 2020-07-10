const Sequelize = require('sequelize')
const sequelize = require('../database')

module.exports = sequelize.define('clients', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
})
