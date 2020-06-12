const Sequelize = require('sequelize')
const sequelize = require('../database')

module.exports = sequelize.define('services', {
  order_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  user: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  number: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  total_price: {
    type: Sequelize.FLOAT,
  },
  currency: {
    type: Sequelize.STRING(5)
  },
  comment: {
    type: Sequelize.STRING,
  },
})