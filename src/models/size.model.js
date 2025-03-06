const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Size = sequelize.define("Size", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  size: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Size;
