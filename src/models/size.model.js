import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Size = sequelize.define("Size", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  size: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Size;
