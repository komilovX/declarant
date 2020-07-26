const Sequelize = require('sequelize')
const sequelize = require('../database')

const IncomingDocument = sequelize.define('decorated_documents', {
  order_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  creator_id: {
    type: Sequelize.INTEGER,
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
