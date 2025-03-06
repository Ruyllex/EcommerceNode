const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.FLOAT, allowNull: false },
  brand: { type: DataTypes.STRING },
  imageUrl: { type: DataTypes.STRING },
  categoryId: { type: DataTypes.INTEGER },
});

module.exports = Product;
