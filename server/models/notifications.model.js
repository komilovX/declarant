const Sequelize = require('sequelize')
const sequelize = require('../database')

module.exports = sequelize.define('notifications', {
  user_id: {
    type: Sequelize.INTEGER,
  },
  content: {
    type: Sequelize.STRING,
  },
  watched: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
})
