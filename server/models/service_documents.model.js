const Sequelize = require("sequelize");
const sequelize = require("../database.js");

module.exports = sequelize.define("service_documents", {
  number: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
