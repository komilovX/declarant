const Sequelize = require('sequelize')
const sequelize = require('../database')

const DeclarantDocuments = sequelize.define('declarant_documents', {
  order_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  declarant_id: {
    type: Sequelize.INTEGER,
  },
  declarant: {
    type: Sequelize.STRING,
  },
  client: {
    type: Sequelize.STRING,
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
    defaultValue: 0,
  },
  total_price: {
    type: Sequelize.FLOAT,
  },
  currency: {
    type: Sequelize.STRING(5)
  },
  file: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING,
    defaultValue: 'active',
  },
  comment: Sequelize.STRING,
})

module.exports = DeclarantDocuments
