const Sequelize = require('sequelize')
const sequelize = require('../database')

const Documents = sequelize.define('documents', {
  number: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: Sequelize.STRING,
  department: Sequelize.STRING,
})

module.exports = Documents
