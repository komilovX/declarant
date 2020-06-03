const Sequelize = require('sequelize')
const sequelize = require('../database')

const IncomingDocument = sequelize.define('incoming_documents', {
  order_id: {
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
  file: {
    type: Sequelize.STRING,
  },
})

module.exports = IncomingDocument
