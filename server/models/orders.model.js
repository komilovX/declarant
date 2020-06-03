const Sequelize = require('sequelize')
const sequelize = require('../database')

const Orders = sequelize.define('orders', {
  date: {
    type: Sequelize.DATEONLY,
    defaultValue: new Date(),
  },
  container: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  product_code: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  post_number: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  client_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  client: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  client_company: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  percent: {
    type: Sequelize.FLOAT,
    defaultValue: 0
  },
  status: {
    type: Sequelize.STRING,
    defaultValue: 'active'
  },
  deleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
})
module.exports = Orders
