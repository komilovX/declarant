const Sequelize = require('sequelize')
const sequelize = require('../database')

const Orders = sequelize.define('orders', {
  creator: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  creator_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  date: {
    type: Sequelize.DATEONLY,
    defaultValue: new Date(),
  },
  date_income: {
    type: Sequelize.DATEONLY,
    defaultValue: new Date(),
  },
  container: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  product: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  inv: {
    type: Sequelize.STRING,
  },
  inv_price: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  currency: {
    type: Sequelize.STRING,
    defaultValue: '$',
  },
  inv_file: {
    type: Sequelize.STRING,
  },
  post_number: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  client_company: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  client: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  declarant: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  percent: {
    type: Sequelize.FLOAT,
    defaultValue: 0,
  },
  status: {
    type: Sequelize.STRING,
    defaultValue: 'active',
  },
  deleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
})
module.exports = Orders
