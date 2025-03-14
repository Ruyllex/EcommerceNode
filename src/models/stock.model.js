import { DataTypes } from "sequelize";
const sequelize = require("../config/database");

const Stock = sequelize.define("Stock", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  productId: { type: DataTypes.UUID, allowNull: false },
  sizeId: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Stock;
